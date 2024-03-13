import Icon from "@ant-design/icons"
import { FC, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import {
  ILLAMixpanel,
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentMemberList,
  getCurrentTeamInfo,
  getPlanUtils,
  getTeamItems,
  teamActions,
} from "@illa-public/user-data"
import { canAccessMember, canManagePayment } from "@illa-public/user-role-utils"
import { getAuthToken, getILLACloudURL } from "@illa-public/utils"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import { SettingContextType } from "@/page/SettingPage/team/interface"
import { setLocalCurrentTeamID } from "@/utils/auth"
import { track } from "@/utils/mixpanelHelper"
import { useLogout } from "../hooks/useLogout"
import { MobileMenuItems } from "./landingMenu"
import {
  landingMenuItemsStyle,
  landingMenuTitleStyle,
  landingTitleStyle,
  teamSwitchStyle,
} from "./style"

const MobileEntrance: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const teams = useSelector(getTeamItems)
  const logout = useLogout()
  const memberList = useSelector(getCurrentMemberList)

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
  const navigate = useNavigate()

  const showBilling = canManagePayment(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const dispatch = useDispatch()

  const switchTeamCallback = (teamID: string, targetIdentifier: string) => {
    const targetTeam = teams?.find((item) => item.id === teamID)
    if (!targetTeam) return
    const currentUseCustomDomain = !!window.customDomain

    if (targetTeam.customInfo.customDomain) {
      const targetPrefixURL = getILLACloudURL(
        targetTeam.customInfo.customDomain,
      )
      window.location.href = `${targetPrefixURL}?token=${getAuthToken()}&redirectURL=${encodeURIComponent(
        `${targetPrefixURL}/setting`,
      )}`
    } else {
      if (!currentUseCustomDomain) {
        setLocalCurrentTeamID(teamID)
        dispatch(teamActions.updateCurrentIdReducer(teamID))
        ILLAMixpanel.setGroup(targetIdentifier)
        navigate(`/setting`)
      } else {
        const targetPrefixURL = getILLACloudURL()
        window.location.href = `${targetPrefixURL}?token=${getAuthToken()}&redirectURL=${encodeURIComponent(
          `${targetPrefixURL}/setting`,
        )}`
      }
    }
  }

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
            parameter4: memberList?.length,
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
        parameter4: memberList?.length,
      },
    )
  }, [currentTeamInfo?.myRole, isOwner, memberList?.length])

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
      <MobileMenuItems itemList={accountOptions} />
      <div css={landingMenuItemsStyle} />
      {currentTeamInfo && (
        <>
          <div css={landingMenuTitleStyle}>
            <Icon component={TeamIcon} />
            <span>{t("profile.setting.group.team")}</span>
          </div>
          <div css={teamSwitchStyle}>
            {/* <TeamSwitchMobile
              teamInfo={currentTeamInfo}
              createElement="setting_page_select"
              reportPage={ILLA_MIXPANEL_CLOUD_PAGE_NAME.SETTING}
              switchTeamCallback={switchTeamCallback}
              showCreateTeam={false}
              teamIconClassName="teamSwitchIcon"
              infoContainerClassName="teamSwitchContainer"
            /> */}
            team switch
          </div>
        </>
      )}
      <MobileMenuItems itemList={teamOptions} />
    </>
  )
}

MobileEntrance.displayName = "MobileEntrance"

export default MobileEntrance
