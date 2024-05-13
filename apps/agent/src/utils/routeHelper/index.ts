import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"

export const getExploreTipisPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/tipis`
}

export const getCreateTipiPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/tipi/create`
}

export const getEditTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/edit`
}

export const getRunTipiPath = (
  teamIdentifier: string,
  tipiID: string,
  tabID: string,
) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/run${tabID ? `/${tabID}` : ""}`
}

export const getTipiDetailPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/detail`
}

export const getMarketTipiDetailPath = (
  teamIdentifier: string,
  tipiID: string,
) => {
  return `/workspace/${teamIdentifier}/marketTipi/${tipiID}/detail`
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
  functionType: string,
) => {
  return `/workspace/${teamIdentifier}/function/create/${functionType}`
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

export const genTabNavigateLink = (
  teamIdentifier: string = "",
  tabType: TAB_TYPE,
  cacheID: string,
  tabID: string,
) => {
  switch (tabType) {
    case TAB_TYPE.CREATE_TIPIS:
      return getCreateTipiPath(teamIdentifier)
    case TAB_TYPE.EDIT_TIPIS:
      return getEditTipiPath(teamIdentifier, cacheID)
    case TAB_TYPE.RUN_TIPIS:
      return `${getRunTipiPath(teamIdentifier, cacheID, tabID)}`
    case TAB_TYPE.CHAT:
      return getChatPath(teamIdentifier, cacheID)
    case TAB_TYPE.CREATE_FUNCTION:
      return getCreateFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EDIT_FUNCTION:
      return getEditFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_TIPIS:
      return getExploreTipisPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_FUNCTION:
      return getExploreFunctionsPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
      return getTipiDetailPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL:
      return getMarketTipiDetailPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_MARKET_FUNCTION_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return ""
  }
}

export enum CREATE_FUNCTION_FROM_SINGLE {
  CREATE_TIPIS = "createTipis",
  EDIT_TIPIS = "editTipis",
  DASHBOARD = "dashboard",
}

export const CREATE_FUNCTION_FROM_SINGLE_KEY = "from"
export const CREATE_FUNCTION_FROM_TAB_KEY = "fromTabID"
