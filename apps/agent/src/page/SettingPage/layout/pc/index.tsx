import Icon from "@ant-design/icons"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import { SUBSCRIBE_PLAN } from "@illa-public/public-types"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import {
  canAccessManage,
  canAccessMember,
  canManagePayment,
} from "@illa-public/user-role-utils"
import TeamSelect from "@/Layout/Workspace/pc/components/TeamSelect"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import Menu from "@/page/SettingPage/components//Menu"
import { GoToPortal } from "@/page/SettingPage/components/GoToPortal"
import { SettingLayoutProps } from "./interface"
import {
  asideMenuStyle,
  backIconStyle,
  layoutWrapperStyle,
  leftAsideWrapperStyle,
  menuWrapperTittleStyle,
  navWrapperStyle,
  rightAsideWrapperStyle,
  rightSectionContainerStyle,
  teamSettingContainerStyle,
  teamSwitchContainerStyle,
} from "./style"

const SettingLayout: FC<SettingLayoutProps> = (props) => {
  const { children } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const teamLicenseAllPaid = canAccessManage(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const showMember = useMemo(() => {
    return !canAccessMember(currentTeamInfo) || !teamLicenseAllPaid
  }, [currentTeamInfo, teamLicenseAllPaid])

  const showBilling = canManagePayment(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const isPurchased = currentTeamInfo?.colla?.plan !== SUBSCRIBE_PLAN.COLLA_FREE

  const accountOptions = [
    {
      path: "account",
      label: t("profile.setting.personal_info"),
      icon: <></>,
    },
    {
      path: "password",
      label: t("profile.setting.password.title"),
      icon: <></>,
    },
    {
      path: "linked",
      label: t("profile.setting.oauth.title.oauth"),
      icon: <></>,
    },
    {
      path: "language",
      label: t("profile.setting.language"),
      icon: <></>,
    },
  ]

  const teamOptions = [
    {
      path: "team-settings",
      label: t("team_setting.team_info.title"),
      hidden: !teamLicenseAllPaid,
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
      label: <GoToPortal />,
      hidden: !showBilling || !isPurchased,
    },
  ]

  return (
    <div css={layoutWrapperStyle}>
      <aside css={leftAsideWrapperStyle}>
        <div css={navWrapperStyle}>
          <Icon
            component={PreviousIcon}
            css={backIconStyle}
            onClick={() => {
              navigate(`/workspace/${currentTeamInfo?.identifier}`)
            }}
          />
          {t("profile.setting.title")}
        </div>
        <div css={asideMenuStyle}>
          <div>
            <div css={menuWrapperTittleStyle}>
              <ProfileIcon />
              <span>{t("profile.setting.group.account")}</span>
            </div>
            <Menu itemList={accountOptions} />
          </div>
          {currentTeamInfo && (
            <div css={teamSettingContainerStyle}>
              <div css={menuWrapperTittleStyle}>
                <TeamIcon />
                <span>{t("profile.setting.group.team")}</span>
              </div>
              <div css={teamSwitchContainerStyle}>
                <TeamSelect />
              </div>
              <Menu itemList={teamOptions} />
            </div>
          )}
        </div>
      </aside>
      <aside css={rightAsideWrapperStyle}>
        <section css={rightSectionContainerStyle}>{children}</section>
      </aside>
    </div>
  )
}

export default SettingLayout
