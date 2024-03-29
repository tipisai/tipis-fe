import { Avatar, Popover } from "antd"
import { FC } from "react"
import { useSelector } from "react-redux"
import { getCurrentUser } from "@illa-public/user-data"
import UserInfoPopoverContent from "../UserInfoPopoverContent"
import { IUserInfoContentProps } from "./interface"
import {
  avatarContainerStyle,
  emailStyle,
  nickNameAndEmailContainerStyle,
  nicknameStyle,
  userInfoContentContainerStyle,
} from "./style"

const UserInfoContent: FC<IUserInfoContentProps> = (props) => {
  const { isMiniSize = false } = props
  const userInfo = useSelector(getCurrentUser)

  return (
    <Popover
      arrow={false}
      autoAdjustOverflow={!isMiniSize}
      placement={isMiniSize ? "right" : "top"}
      trigger={["click"]}
      align={{
        offset: isMiniSize ? [16, -32] : [0, -8],
      }}
      content={<UserInfoPopoverContent />}
      overlayInnerStyle={{
        padding: "8px",
      }}
    >
      <div css={userInfoContentContainerStyle(isMiniSize)}>
        <div css={avatarContainerStyle}>
          <Avatar
            src={userInfo.avatar}
            shape="circle"
            size={isMiniSize ? 24 : 32}
          >
            {userInfo.nickname[0]}
          </Avatar>
        </div>
        {!isMiniSize && (
          <div css={nickNameAndEmailContainerStyle}>
            <span css={nicknameStyle}>{userInfo.nickname}</span>
            <span css={emailStyle}>{userInfo.email}</span>
          </div>
        )}
      </div>
    </Popover>
  )
}

UserInfoContent.displayName = "UserInfoContent"

export default UserInfoContent
