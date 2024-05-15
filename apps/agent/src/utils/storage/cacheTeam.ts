import { ITeamInfoVO } from "@illa-public/public-types"
import { TIPISStorage } from "@/utils/storage"

export const setLocalTeamIdentifier = (teamIdentifier: string) => {
  return TIPISStorage.setLocalStorage("teamIdentifier", teamIdentifier)
}

export const getLocalTeamIdentifier = () => {
  return TIPISStorage.getLocalStorage("teamIdentifier")
}

export const removeLocalTeamIdentifier = () => {
  return TIPISStorage.removeLocalStorage("teamIdentifier")
}

export const setSessionCurrentTeamInfo = (teamInfo: ITeamInfoVO) => {
  TIPISStorage.setSessionStorage("teamInfo", teamInfo)
}

export const getSessionCurrentTeamInfo = () => {
  return TIPISStorage.getSessionStorage("teamInfo") as ITeamInfoVO | undefined
}
