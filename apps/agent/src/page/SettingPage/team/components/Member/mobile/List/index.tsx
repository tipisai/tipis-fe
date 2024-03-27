import { FC } from "react"
import { useSelector } from "react-redux"
import {
  getCurrentTeamInfo,
  useGetMemberListQuery,
} from "@illa-public/user-data"
import { MobileMemberListItem } from "../ListItem"
import { listContainerStyle } from "./style"

export const MobileMemberList: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const { data: memberList } = useGetMemberListQuery(currentTeamInfo.id)
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
