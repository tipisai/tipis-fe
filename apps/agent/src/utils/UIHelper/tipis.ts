import { ITeamInfoVO, USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"

export const canShownCreateTipi = (teamInfo?: ITeamInfoVO) =>
  teamInfo && isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, false)

export const canShownEditTipi = (teamInfo?: ITeamInfoVO) =>
  teamInfo && isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, false)

export const canShowShareTipi = (teamInfo?: ITeamInfoVO) => {
  if (!teamInfo) return false
  if (isBiggerThanTargetRole(USER_ROLE.ADMIN, teamInfo.myRole, true)) {
    return true
  }
  if (isBiggerThanTargetRole(USER_ROLE.EDITOR, teamInfo.myRole, true)) {
    return true
  }
  if (isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, true)) {
    return true
  }
  return false
}
