import Icon from "@ant-design/icons"
import { Button, ConfigProvider } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useIntercom } from "react-use-intercom"
import { openLinkOnNewTab } from "@illa-public/cross-platform-utils"
import { TipisTrack } from "@illa-public/track-utils"
import {
  getCurrentTeamInfo,
  getTeamItems,
  useGetUserInfoQuery,
} from "@illa-public/user-data"
import DocumentIcon from "@/assets/public/document.svg?react"
import HelpCenterIcon from "@/assets/public/help-center.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
import {
  buttonContentContainerStyle,
  iconContainerStyle,
  popoverContentContainerStyle,
} from "./style"

const UserInfoPopoverContent: FC = () => {
  const { t } = useTranslation()

  const { boot, show } = useIntercom()
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const teams = useSelector(getTeamItems)!
  const currentTeam = useSelector(getCurrentTeamInfo)!

  const onClickChatWithUs = () => {
    TipisTrack.track("click_help_center")
    boot({
      userId: currentUserInfo?.id,
      email: currentUserInfo?.email,
      company: {
        companyId: currentTeam?.id,
        name: currentTeam?.identify,
      },
      companies: teams.map((team) => ({
        companyId: team.id,
        name: team.identify,
      })),
    })
    show()
  }

  const onClickOpenDocs = () => {
    TipisTrack.track("open_docs")
    openLinkOnNewTab("https://help.tipis.ai")
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            paddingInlineLG: "8px",
          },
        },
      }}
    >
      <div css={popoverContentContainerStyle}>
        <Button type="text" block size="large" onClick={onClickChatWithUs}>
          <div css={buttonContentContainerStyle}>
            <Icon component={HelpCenterIcon} css={iconContainerStyle} />
            {t("homepage.left_panel.setting.help_center")}
          </div>
        </Button>
        <Button type="text" block size="large" onClick={onClickOpenDocs}>
          <div css={buttonContentContainerStyle}>
            <Icon component={DocumentIcon} css={iconContainerStyle} />
            {t("homepage.left_panel.setting.documentation")}
          </div>
        </Button>
        <Button type="text" block size="large">
          <Link to="/setting">
            <div
              css={buttonContentContainerStyle}
              onClick={() => {
                TipisTrack.track("click_settings_entry")
              }}
            >
              <Icon component={SettingIcon} css={iconContainerStyle} />
              {t("page.left.menu.setting")}
            </div>
          </Link>
        </Button>
      </div>
    </ConfigProvider>
  )
}

export default UserInfoPopoverContent
