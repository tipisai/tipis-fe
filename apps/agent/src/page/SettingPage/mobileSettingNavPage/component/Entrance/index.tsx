import Icon from "@ant-design/icons"
import { FC, useEffect, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { USER_ROLE } from "@illa-public/public-types"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { getPlanUtils } from "@illa-public/user-data"
import { canAccessMember, canManagePayment } from "@illa-public/user-role-utils"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { useLeaveTeamModal } from "@/page/SettingPage/hooks/useLeaveTeamModal"
import { useLogout } from "@/page/SettingPage/hooks/useLogout"
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
  const currentTeamInfo = useGetCurrentTeamInfo()
  const logout = useLogout()

  const handleLeaveOrDeleteTeamModal = useLeaveTeamModal()
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
    // TODO: wtf not support
    // {
    //   path: "/setting/linked",
    //   label: t("profile.setting.oauth.title.oauth"),
    // },
    {
      path: "/setting/language",
      label: t("profile.setting.language"),
    },
    {
      path: "",
      label: t("profile.setting.logout"),
      onClick: () => {
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
            handleLeaveOrDeleteTeamModal()
          },
        },
      ]
    : []

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.MOBILE_SETTING_NAV)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.MOBILE_SETTING_NAV)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.MOBILE_SETTING_NAV)
  })

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
