import { TeamInfo, USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"

export const canShownCreateTipi = (teamInfo?: TeamInfo) =>
  teamInfo && isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, false)

export const canShownEditTipi = (teamInfo?: TeamInfo) =>
  teamInfo && isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, false)

export const canShowShareTipi = (teamInfo?: TeamInfo) => {
  if (!teamInfo) return false
  if (isBiggerThanTargetRole(USER_ROLE.ADMIN, teamInfo.myRole, true)) {
    return true
  }
  if (
    teamInfo.permission.allowEditorInvite &&
    isBiggerThanTargetRole(USER_ROLE.EDITOR, teamInfo.myRole, true)
  ) {
    return true
  }
  if (
    teamInfo.permission.allowViewerInvite &&
    isBiggerThanTargetRole(USER_ROLE.VIEWER, teamInfo.myRole, true)
  ) {
    return true
  }
  return false
}
