import { klona } from "klona/json"
import {
  ChatSendRequestPayload,
  ChatWsAppendResponse,
} from "@/components/PreviewChat/interface"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { INIT_TABS } from "@/redux/ui/recentTab/state"
import { teamDataDataBase } from "."
import { ITeamData, IUiHistoryData } from "./interface"

export const getTeamDataByTeamID = async (teamID: string) => {
  return await teamDataDataBase.getItem<ITeamData>(teamID)
}

export const setTeamDataByTeamID = (teamID: string, teamData: ITeamData) => {
  teamDataDataBase.setItem(teamID, teamData)
}

export const getUiHistoryDataByCacheID = async (
  teamID: string,
  cacheID: string,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return {}
  const uiHistory = teamData.uiHistory ?? {}
  const targetCacheID = uiHistory[cacheID]
  return targetCacheID ?? {}
}

export const setUiHistoryData = async (
  teamID: string,
  cacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  newTeamData.uiHistory = { ...newTeamData.uiHistory, [cacheID]: uiHistoryData }
  setTeamDataByTeamID(teamID, newTeamData)
}

export const deleteUiHistoryData = async (teamID: string, cacheID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  if (!newTeamData.uiHistory || !newTeamData.uiHistory[cacheID]) return
  delete newTeamData.uiHistory[cacheID]
  setTeamDataByTeamID(teamID, newTeamData)
}

export const updateUiHistoryData = async (
  teamID: string,
  oldCacheID: string,
  newCacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  const oldData = await getUiHistoryDataByCacheID(teamID, oldCacheID)
  await setUiHistoryData(teamID, newCacheID, { ...oldData, ...uiHistoryData })
  await deleteUiHistoryData(teamID, oldCacheID)
}

export const getTabs = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) {
    await setTabs(teamID, INIT_TABS)
    return INIT_TABS
  }
  const tabsInfo = teamData.tabsInfo ?? INIT_TABS
  return tabsInfo
}

export const setTabs = async (teamID: string, tabInfos: ITabInfo[]) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  newTeamData.tabsInfo = tabInfos
  setTeamDataByTeamID(teamID, newTeamData)
}

export const addTabs = async (teamID: string, tabInfo: ITabInfo) => {
  const tabs = await getTabs(teamID)
  const newTabs = [tabInfo, ...tabs]
  await setTabs(teamID, newTabs)
}

export const removeTabs = async (teamID: string, tabID: string) => {
  const tabs = await getTabs(teamID)
  const targetTab = tabs.find((tab) => tab.tabID === tabID)
  if (!targetTab) return
  const cacheID = targetTab.cacheID

  const newTabs = tabs.filter((tab) => tab.tabID !== tabID)
  await setTabs(teamID, newTabs)
  await deleteUiHistoryData(teamID, cacheID)
}

export const updateTabs = async (
  teamID: string,
  tabID: string,
  newTabInfo: Partial<ITabInfo>,
) => {
  const tabs = await getTabs(teamID)
  const newTabs = tabs.map((tab) => {
    if (tab.tabID === tabID) {
      return {
        ...tab,
        ...newTabInfo,
      }
    }
    return tab
  })
  await setTabs(teamID, newTabs)
}

export const getCacheChatMessage = async (teamID: string, cacheID: string) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  return uiHistoryCacheData.chatMessage ?? []
}

export const getEditCacheChatMessage = async (
  teamID: string,
  cacheID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  return uiHistoryCacheData.chatMessage?.edit ?? []
}

export const getRunCacheChatMessage = async (
  teamID: string,
  cacheID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  return uiHistoryCacheData.chatMessage?.run ?? []
}

export const setEditCacheChatMessage = async (
  teamID: string,
  tabID: string,
  chatMessages: (ChatWsAppendResponse | ChatSendRequestPayload)[],
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  if (!Array.isArray(newUIHistoryCacheData.chatMessage.edit)) {
    newUIHistoryCacheData.chatMessage.edit = []
  }
  newUIHistoryCacheData.chatMessage.edit = chatMessages

  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const addEditCacheChatMessage = async (
  teamID: string,
  tabID: string,
  chatMessage: ChatWsAppendResponse | ChatSendRequestPayload,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  if (!Array.isArray(newUIHistoryCacheData.chatMessage.edit)) {
    newUIHistoryCacheData.chatMessage.edit = []
  }
  newUIHistoryCacheData.chatMessage.edit.push(chatMessage)

  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const deleteEditCacheChatMessage = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  newUIHistoryCacheData.chatMessage.edit = []
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const setRunCacheChatMessage = async (
  teamID: string,
  tabID: string,
  chatMessages: (ChatWsAppendResponse | ChatSendRequestPayload)[],
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  if (!Array.isArray(newUIHistoryCacheData.chatMessage.run)) {
    newUIHistoryCacheData.chatMessage.run = []
  }
  newUIHistoryCacheData.chatMessage.run = chatMessages

  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const addRunCacheChatMessage = async (
  teamID: string,
  tabID: string,
  chatMessage: ChatWsAppendResponse | ChatSendRequestPayload,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  if (!Array.isArray(newUIHistoryCacheData.chatMessage.run)) {
    newUIHistoryCacheData.chatMessage.run = []
  }
  newUIHistoryCacheData.chatMessage.run.push(chatMessage)

  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const deleteRunCacheChatMessage = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [] }
  }
  newUIHistoryCacheData.chatMessage.run = []
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const getCacheUIState = async (teamID: string, cacheID: string) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  return uiHistoryCacheData.uiState
}

export const setCacheUIState = async (
  teamID: string,
  cacheID: string,
  uiState: unknown,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.uiState = uiState
  await setUiHistoryData(teamID, cacheID, newUIHistoryCacheData)
}

export const deleteCacheUIState = async (teamID: string, cacheID: string) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.uiState = undefined
  await setUiHistoryData(teamID, cacheID, newUIHistoryCacheData)
}
