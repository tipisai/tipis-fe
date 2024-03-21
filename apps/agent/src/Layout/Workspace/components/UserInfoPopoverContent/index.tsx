import Icon from "@ant-design/icons"
import { Button, ConfigProvider } from "antd"
import { FC } from "react"
import { Link } from "react-router-dom"
import DiscordIcon from "@/assets/public/discord.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
import {
  buttonContentContainerStyle,
  iconContainerStyle,
  popoverContentContainerStyle,
} from "./style"

const UserInfoPopoverContent: FC = () => {
  return (
    <ConfigProvider>
      <div css={popoverContentContainerStyle}>
        <Button type="text" block size="large">
          <a target="_blank" href="https://www.illa.ai" rel="noreferrer">
            <div css={buttonContentContainerStyle}>
              <Icon component={DiscordIcon} css={iconContainerStyle} />
              Join our discord
            </div>
          </a>
        </Button>
        <Button type="text" block size="large">
          <Link to="/setting">
            <div css={buttonContentContainerStyle}>
              <Icon component={SettingIcon} css={iconContainerStyle} />
              Setting
            </div>
          </Link>
        </Button>
      </div>
    </ConfigProvider>
  )
}

export default UserInfoPopoverContent
