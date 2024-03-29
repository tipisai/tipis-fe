import { FC } from "react"
import { useGetMemberListQuery } from "@illa-public/user-data"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MobileMemberListItem } from "../ListItem"
import { listContainerStyle } from "./style"

export const MobileMemberList: FC = () => {
  const teamInfo = useGetCurrentTeamInfo()!

  const { data: memberList } = useGetMemberListQuery(teamInfo.id)
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
