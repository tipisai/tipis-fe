import { Avatar } from "antd"
import { FC } from "react"
import { useSelector } from "react-redux"
import { getCurrentUser } from "@illa-public/user-data"
import {
  avatarContainerStyle,
  emailStyle,
  nickNameAndEmailContainerStyle,
  nicknameStyle,
  userInfoContentContainerStyle,
} from "./style"

const UserInfoContent: FC = () => {
  const userInfo = useSelector(getCurrentUser)
  return (
    <div css={userInfoContentContainerStyle}>
      <div css={avatarContainerStyle}>
        <Avatar src={userInfo.avatar} shape="circle" size={32} />
      </div>
      <div css={nickNameAndEmailContainerStyle}>
        <span css={nicknameStyle}>{userInfo.nickname}</span>
        <span css={emailStyle}>{userInfo.email}</span>
      </div>
    </div>
  )
}

export default UserInfoContent
