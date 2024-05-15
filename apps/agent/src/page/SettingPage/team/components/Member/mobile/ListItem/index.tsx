import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import { RoleSelector } from "@illa-public/role-selector"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "../../context"
import { ListItemProps } from "./interface"
import {
  emailStyle,
  listAvatarAndNameContainerStyle,
  listItemContainerStyle,
  listRoleSelectStyle,
  nickNameAndEmailContainerStyle,
  nickNameContainerStyle,
  statusStyle,
} from "./style"

export const MobileMemberListItem: FC<ListItemProps> = (props) => {
  const { nickName, userID, email, status, userRole, avatarURL, teamMemberID } =
    props

  const { t } = useTranslation()
  const { handleChangeTeamMembersRole } = useContext(MemberContext)
  const teamInfo = useGetCurrentTeamInfo()!
  const { data } = useGetUserInfoQuery(null)
  const currentUserID = data?.id

  const currentUserRole = teamInfo.myRole

  const executedUserRole = userRole !== USER_ROLE.OWNER ? [USER_ROLE.OWNER] : []

  return (
    <div css={listItemContainerStyle}>
      <div css={listAvatarAndNameContainerStyle}>
        <Avatar name={nickName} id={userID} avatarUrl={avatarURL} size={40} />
        <div css={nickNameAndEmailContainerStyle}>
          <div css={nickNameContainerStyle}>
            <span>{nickName}</span>
            {status === USER_STATUS.PENDING && (
              <span> ({t("user_management.status.pending")})</span>
            )}
            {userID === currentUserID && (
              <span css={statusStyle}>
                {" "}
                ({t("user_management.status.current-user")})
              </span>
            )}
          </div>
          <span css={emailStyle}>{email}</span>
        </div>
      </div>

      <div css={listRoleSelectStyle}>
        <RoleSelector
          value={userRole}
          currentUserRole={currentUserRole}
          isSelf={currentUserID === userID}
          onClickItem={(role) => {
            handleChangeTeamMembersRole(teamMemberID, role)
          }}
          excludeUserRole={executedUserRole}
        />
      </div>
    </div>
  )
}
