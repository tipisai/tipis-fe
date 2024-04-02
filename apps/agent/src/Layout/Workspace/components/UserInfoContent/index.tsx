import { Avatar, Popover } from "antd"
import { FC } from "react"
import { useSelector } from "react-redux"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentUser } from "@illa-public/user-data"
import { getColorByString } from "@illa-public/utils"
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

  const onClickUserInfo = () => {
    TipisTrack.track("click_user_name")
  }

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
      <div
        css={userInfoContentContainerStyle(isMiniSize)}
        onClick={onClickUserInfo}
      >
        <div css={avatarContainerStyle}>
          <Avatar
            src={userInfo.avatar}
            shape="circle"
            size={isMiniSize ? 24 : 32}
            style={{
              fontSize: isMiniSize ? 12 : 16,
              background: userInfo?.avatar
                ? "#ffffff"
                : getColorByString(userInfo?.userID || ""),
            }}
          >
            {userInfo.nickname[0]
              ? userInfo.nickname[0].toLocaleUpperCase()
              : "U"}
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
