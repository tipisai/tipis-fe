import Icon from "@ant-design/icons"
import { Avatar, Button, Popover } from "antd"
import { FC, forwardRef } from "react"
import { useSelector } from "react-redux"
import { getCurrentUser } from "@illa-public/user-data"
import DiscordIcon from "@/assets/public/discord.svg?react"
import DocumentIcon from "@/assets/public/document.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
import { popoverContentContainerStyle } from "../../modules/Menu/MiniMenu/style"
import {
  avatarContainerStyle,
  emailStyle,
  nickNameAndEmailContainerStyle,
  nicknameStyle,
  userInfoContentContainerStyle,
} from "./style"

const UserInfoContent: FC = forwardRef<HTMLDivElement>((_props, ref) => {
  const userInfo = useSelector(getCurrentUser)

  return (
    <Popover
      arrow={false}
      autoAdjustOverflow
      placement="top"
      trigger={["click"]}
      align={{
        offset: [0, -8],
      }}
      content={
        <div css={popoverContentContainerStyle}>
          <Button type="text" block icon={<Icon component={DiscordIcon} />}>
            Click me!
          </Button>
          <Button type="text" block icon={<Icon component={DocumentIcon} />}>
            Click me!
          </Button>
          <Button type="text" block icon={<Icon component={SettingIcon} />}>
            Click me!
          </Button>
        </div>
      }
    >
      <div css={userInfoContentContainerStyle} ref={ref}>
        <div css={avatarContainerStyle}>
          <Avatar src={userInfo.avatar} shape="circle" size={32} />
        </div>
        <div css={nickNameAndEmailContainerStyle}>
          <span css={nicknameStyle}>{userInfo.nickname}</span>
          <span css={emailStyle}>{userInfo.email}</span>
        </div>
      </div>
    </Popover>
  )
})

UserInfoContent.displayName = "UserInfoContent"

export default UserInfoContent
