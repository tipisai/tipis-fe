import Icon from "@ant-design/icons"
import { FC, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  getPlanUtils,
  getTeamItems,
} from "@illa-public/user-data"
import { canAccessMember, canManagePayment } from "@illa-public/user-role-utils"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { useLogout } from "@/page/SettingPage/hooks/useLogout"
import { SettingContextType } from "@/page/SettingPage/team/interface"
import { track } from "@/utils/mixpanelHelper"
import SettingMenu from "../Menu"
import {
  landingMenuItemsStyle,
  landingMenuTitleStyle,
  landingTitleStyle,
  teamSwitchStyle,
} from "./style"

const Entrance: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const teams = useSelector(getTeamItems)
  const logout = useLogout()

  const isOwner = currentTeamInfo?.myRole === USER_ROLE.OWNER

  const { onClickLeaveTeam } = useOutletContext<SettingContextType>()
  const { showMember, leaveLabel } = useMemo(() => {
    return {
      showMember: !canAccessMember(currentTeamInfo),
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
      path: "account",
      label: t("profile.setting.personal_info"),
    },
    {
      path: "password",
      label: t("profile.setting.password.title"),
    },
    {
      path: "linked",
      label: t("profile.setting.oauth.title.oauth"),
    },
    {
      path: "language",
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

  const teamOptions = [
    {
      path: "team-settings",
      label: t("team_setting.team_info.title"),
    },
    {
      path: "members",
      label: t("team_setting.left_panel.member"),
      hidden: showMember,
    },
    {
      path: "billing",
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
