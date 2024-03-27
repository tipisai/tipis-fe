import Icon from "@ant-design/icons"
import { FC, useEffect, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useOutletContext } from "react-router-dom"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import { getPlanUtils, useGetTeamsInfoQuery } from "@illa-public/user-data"
import { canAccessMember, canManagePayment } from "@illa-public/user-role-utils"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { useLogout } from "@/page/SettingPage/hooks/useLogout"
import { SettingContextType } from "@/page/SettingPage/team/interface"
import { track } from "@/utils/mixpanelHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import SettingMenu from "../Menu"
import {
  landingMenuItemsStyle,
  landingMenuTitleStyle,
  landingTitleStyle,
  teamSwitchStyle,
} from "./style"

const Entrance: FC = () => {
  const { t } = useTranslation()
  const { data: teams } = useGetTeamsInfoQuery(null)
  const currentTeamInfo = useGetCurrentTeamInfo()
  const logout = useLogout()

  const isOwner = currentTeamInfo?.myRole === USER_ROLE.OWNER

  const { onClickLeaveTeam } = useOutletContext<SettingContextType>()
  const { hiddenMember, leaveLabel } = useMemo(() => {
    return {
      hiddenMember: !canAccessMember(currentTeamInfo),
      leaveLabel:
        currentTeamInfo?.myRole === USER_ROLE.OWNER
          ? t("team_setting.left_panel.delete")
          : t("team_setting.left_panel.leave"),
    }
  }, [currentTeamInfo, t])

  const showBilling = canManagePayment(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const accountOptions = [
    {
      path: "/setting/account",
      label: t("profile.setting.personal_info"),
    },
    {
      path: "/setting/password",
      label: t("profile.setting.password.title"),
    },
    {
      path: "/setting/linked",
      label: t("profile.setting.oauth.title.oauth"),
    },
    {
      path: "/setting/language",
      label: t("profile.setting.language"),
    },
    {
      path: "",
      label: t("profile.setting.logout"),
      onClick: () => {
        track(
          ILLA_MIXPANEL_EVENT_TYPE.CLICK,
          ILLA_MIXPANEL_CLOUD_PAGE_NAME.SETTING,
          { element: "log_out", parameter3: teams?.length },
        )
        logout()
      },
    },
  ]

  const teamOptions = currentTeamInfo?.identifier
    ? [
        {
          path: `/setting/${currentTeamInfo.identifier}/team-settings`,
          label: t("team_setting.team_info.title"),
        },
        {
          path: `/setting/${currentTeamInfo.identifier}/members`,
          label: t("team_setting.left_panel.member"),
          hidden: hiddenMember,
        },
        {
          path: `/setting/${currentTeamInfo.identifier}/billing`,
          label: t("billing.menu.billing"),
          hidden: !showBilling,
        },
        {
          path: "",
          label: leaveLabel,
          onClick: () => {
            track(
              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
              ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
              {
                element: isOwner ? "delete" : "leave",
                parameter1: isOwner ? "delete_button" : undefined,
                parameter11: currentTeamInfo?.myRole,
              },
            )
            onClickLeaveTeam && onClickLeaveTeam()
          },
        },
      ]
    : []

  useEffect(() => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.SHOW,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
      {
        element: isOwner ? "delete" : "leave",
        parameter1: isOwner ? "delete_button" : undefined,
        parameter11: currentTeamInfo?.myRole,
      },
    )
  }, [currentTeamInfo?.myRole, isOwner])

  useEffect(() => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.SETTING,
      { element: "log_out", parameter3: teams?.length },
    )
  }, [teams?.length])

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.title")}</title>
      </Helmet>
      <div css={landingTitleStyle}>{t("profile.setting.title")}</div>
      <div css={landingMenuTitleStyle}>
        <Icon component={ProfileIcon} />
        <span>{t("profile.setting.group.account")}</span>
      </div>
      <SettingMenu itemList={accountOptions} />
      <div css={landingMenuItemsStyle} />
      {currentTeamInfo && (
        <>
          <div css={landingMenuTitleStyle}>
            <Icon component={TeamIcon} />
            <span>{t("profile.setting.group.team")}</span>
          </div>
          <div css={teamSwitchStyle}>
            <TeamSelect />
          </div>
        </>
      )}
      <SettingMenu itemList={teamOptions} />
    </>
  )
}

export default Entrance
