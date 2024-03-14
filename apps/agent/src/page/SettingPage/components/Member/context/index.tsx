import { createContext } from "react"
import { MemberInfo, USER_ROLE } from "@illa-public/public-types"

interface IMemberContext {
  memberList: MemberInfo[]
  handleCopy: (inviteLink: string) => void
  handleClickInviteButton: () => void
  showInviteButton: boolean
  inviteModalVisible: boolean
  closeInviteModal: () => void
  handleChangeTeamMembersRole: (
    teamMemberID: string,
    userRole: USER_ROLE,
  ) => void
}

export const MemberContext = createContext({} as IMemberContext)
