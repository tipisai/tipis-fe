import Icon from "@ant-design/icons"
import { Avatar, Dropdown } from "antd"
import { FC, forwardRef } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getCurrentUser } from "@illa-public/user-data"
import DiscordIcon from "@/assets/public/discord.svg?react"
import DocumentIcon from "@/assets/public/document.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
import {
  avatarContainerStyle,
  emailStyle,
  nickNameAndEmailContainerStyle,
  nicknameStyle,
  userInfoContentContainerStyle,
} from "./style"

const UserInfoContent: FC = forwardRef<HTMLDivElement>((_props, ref) => {
  const userInfo = useSelector(getCurrentUser)

  const menuItems = [
    {
      key: "1",
      icon: <Icon component={DiscordIcon} />,
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://discord.com">
          Join our Discord
        </a>
      ),
    },
    {
      key: "2",
      icon: <Icon component={DocumentIcon} />,
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.illa.com"
        >
          Documentation
        </a>
      ),
    },
    {
      key: "3",
      icon: <Icon component={SettingIcon} />,
      label: <Link to="/setting">Setting</Link>,
    },
  ]

  return (
    <Dropdown
      arrow={false}
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
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
    </Dropdown>
  )
})

UserInfoContent.displayName = "UserInfoContent"

export default UserInfoContent
