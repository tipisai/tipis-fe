import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import ProfileIcon from "@/assets/setting/profile.svg?react"
import TeamIcon from "@/assets/setting/team.svg?react"
import TeamSelect from "@/components/TeamSelect"
import Menu from "@/page/SettingPage/components//Menu"
// import { GoToPortal } from "@/page/SettingPage/components/GoToPortal"
import { getChatPath, getTeamInfoSetting } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { SettingLayoutProps } from "../interface"
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

  const { data } = useGetTeamsInfoQuery(null)

  const currentTeamInfo = useGetCurrentTeamInfo()
  // const hiddenMember = useMemo(() => {
  //   return !canAccessMember(currentTeamInfo)
  // }, [currentTeamInfo])

  // const showBilling = canManagePayment(
  //   currentTeamInfo?.myRole,
  //   getPlanUtils(currentTeamInfo),
  // )

  // const isPurchased =
  //   currentTeamInfo?.credit?.plan !== SUBSCRIBE_PLAN.CREDIT_FREE

  const accountOptions = [
    {
      path: "/setting/account",
      label: t("profile.setting.personal_info"),
      icon: <></>,
    },
    {
      path: "/setting/linked",
      label: t("profile.setting.oauth.title.oauth"),
      icon: <></>,
    },
    {
      path: "/setting/language",
      label: t("profile.setting.language"),
      icon: <></>,
    },
  ]

  const teamOptions = currentTeamInfo?.identify
    ? [
        {
          path: `/setting/${currentTeamInfo.identify}/team-settings`,
          label: t("team_setting.team_info.title"),
        },
        {
          path: `/setting/${currentTeamInfo.identify}/members`,
          label: t("team_setting.left_panel.member"),
          // hidden: hiddenMember,
        },
        // {
        //   path: `/setting/${currentTeamInfo.identify}/billing`,
        //   label: t("billing.menu.billing"),
        //   hidden: !showBilling,
        // },
        // {
        //   path: "",
        //   label: <GoToPortal />,
        //   hidden: !showBilling || !isPurchased,
        // },
      ]
    : []

  const handleSwitchTeam = (_: string, teamIdentifier: string) => {
    navigate(getTeamInfoSetting(teamIdentifier))
  }

  return (
    <div css={layoutWrapperStyle}>
      <aside css={leftAsideWrapperStyle}>
        <div css={navWrapperStyle}>
          <Icon
            component={PreviousIcon}
            css={backIconStyle}
            onClick={() => {
              navigate(getChatPath(currentTeamInfo?.identify ?? ""))
            }}
          />
          {t("profile.setting.title")}
        </div>
        <div css={asideMenuStyle}>
          <div>
            <div css={menuWrapperTittleStyle}>
              <Icon component={ProfileIcon} />
              <span>{t("profile.setting.group.account")}</span>
            </div>
            <Menu itemList={accountOptions} />
          </div>
          {Array.isArray(data) && data.length > 0 && (
            <div css={teamSettingContainerStyle}>
              <div css={menuWrapperTittleStyle}>
                <Icon component={TeamIcon} />
                <span>{t("profile.setting.group.team")}</span>
              </div>
              <div css={teamSwitchContainerStyle}>
                <TeamSelect onChangeTeam={handleSwitchTeam} />
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
