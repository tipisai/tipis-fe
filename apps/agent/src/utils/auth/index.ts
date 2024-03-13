import { USER_ROLE } from "@illa-public/public-types"
import { TIPISStorage } from "@/utils/storage"

const CURRENT_TEAM_ID_KEY = "currentTeamID"

export const setLocalTeam = (teamIdentifier: string) => {
  return TIPISStorage.setLocalStorage("teamIdentifier", teamIdentifier)
}

export const setLocalCurrentTeamID = (teamID: string) => {
  TIPISStorage.setLocalStorage(CURRENT_TEAM_ID_KEY, teamID)
}

export const getLocalCurrentTeamID = () => {
  return TIPISStorage.getLocalStorage(CURRENT_TEAM_ID_KEY)
}

export const getLocalTeam = () => {
  return TIPISStorage.getLocalStorage("teamIdentifier")
}

export const removeLocalTeam = () => {
  return TIPISStorage.removeLocalStorage("teamIdentifier")
}

export const checkAuthRole = (
  currentRole: USER_ROLE,
  allowedRoles: USER_ROLE[],
) => {
  return allowedRoles.includes(currentRole)
}
