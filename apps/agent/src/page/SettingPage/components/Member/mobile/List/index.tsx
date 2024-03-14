import { FC, useContext } from "react"
import { MemberContext } from "../../context"
import { MobileMemberListItem } from "../ListItem"
import { listContainerStyle } from "./style"

export const MobileMemberList: FC = () => {
  const { memberList } = useContext(MemberContext)
  return (
    <div css={listContainerStyle}>
      {memberList?.map((item) => {
        return (
          <MobileMemberListItem
            key={item.userID}
            nickName={item.nickname}
            userID={item.userID}
            teamMemberID={item.teamMemberID}
            email={item.email}
            status={item.userStatus}
            userRole={item.userRole}
            avatarURL={item.avatar}
          />
        )
      })}
    </div>
  )
}
