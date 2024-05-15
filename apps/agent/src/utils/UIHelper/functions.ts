import { ITeamInfoVO, USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"

export const canShowCreateFunction = (teamInfo?: ITeamInfoVO) => {
  return (
    teamInfo && isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, false)
  )
}
