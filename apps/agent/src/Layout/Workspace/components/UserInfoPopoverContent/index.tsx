import Icon from "@ant-design/icons"
import { Button, ConfigProvider } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useIntercom } from "react-use-intercom"
import {
  getCurrentTeamInfo,
  getCurrentUser,
  getTeamItems,
} from "@illa-public/user-data"
import DiscordIcon from "@/assets/public/discord.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
import {
  buttonContentContainerStyle,
  iconContainerStyle,
  popoverContentContainerStyle,
} from "./style"

const UserInfoPopoverContent: FC = () => {
  const { t } = useTranslation()

  const { boot, show } = useIntercom()
  const userInfo = useSelector(getCurrentUser)
  const teams = useSelector(getTeamItems)!
  const currentTeam = useSelector(getCurrentTeamInfo)!

  const onClickChatWithUs = () => {
    boot({
      userId: userInfo.userID,
      email: userInfo.email,
      company: {
        companyId: currentTeam?.id,
        name: currentTeam?.identifier,
      },
      companies: teams.map((team) => ({
        companyId: team.id,
        name: team.identifier,
      })),
    })
    show()
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
            <Icon component={DiscordIcon} css={iconContainerStyle} />
            {t("homepage.left_panel.setting.help_center")}
          </div>
        </Button>
        <Button type="text" block size="large">
          <Link to="/setting">
            <div css={buttonContentContainerStyle}>
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
