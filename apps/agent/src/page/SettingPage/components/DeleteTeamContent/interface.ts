import { ITeamInfoVO } from "@illa-public/public-types"

export interface IDeleteTeamContent {
  onCancel: () => void
  deleteTeam: () => void
  teamInfo: ITeamInfoVO
}
