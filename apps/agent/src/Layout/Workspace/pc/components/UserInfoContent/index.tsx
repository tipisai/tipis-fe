import { Avatar } from "antd"
import { FC } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getCurrentUser } from "@illa-public/user-data"
import { getSettingPath } from "@/utils/routeHelper"
import {
  avatarContainerStyle,
  emailStyle,
  nickNameAndEmailContainerStyle,
  nicknameStyle,
  userInfoContentContainerStyle,
} from "./style"

const UserInfoContent: FC = () => {
  const userInfo = useSelector(getCurrentUser)
  const { teamIdentifier } = useParams()
  const navigate = useNavigate()
  const toSettingPage = () => {
    if (!teamIdentifier) return
    const url = getSettingPath(teamIdentifier)
    navigate(url)
  }
  return (
    <div css={userInfoContentContainerStyle} onClick={toSettingPage}>
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
