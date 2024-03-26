import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"

export const getExploreTipisPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/tipis`
}

export const getCreateTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/create`
}

export const getEditTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/edit`
}

export const getRunTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/run`
}

export const getTipiDetailPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/detail`
}

export const getExploreFunctionsPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/functions`
}

export const getChatPath = (
  teamIdentifier: string,
  chatID: string = DEFAULT_CHAT_ID,
) => {
  return `/workspace/${teamIdentifier}/chat/${chatID}`
}

export const getCreateFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/create`
}

export const getEditFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/edit`
}

export const getRunFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/run`
}

export const getFunctionDetailPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/detail`
}

export const getTeamInfoSetting = (teamIdentifier: string) => {
  return `/setting/${teamIdentifier}/team-settings`
}

export const REGISTER_PATH = "/user/register"
export const FORGOT_PASSWORD_PATH = "/user/forgotPassword"
export const LOGIN_PATH = "/user/login"
export const PASSWORD_PATH = "/setting/password"
export const LINKED_PATH = "/setting/linked"
export const EMPTY_TEAM_PATH = "/empty"
