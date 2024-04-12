import { klona } from "klona/json"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { DEFAULT_CHAT_ID, INIT_TABS } from "@/redux/ui/recentTab/state"
import { teamDataDataBase } from "."
import {
  ChatMessage,
  IGroupMessage,
} from "../../components/PreviewChat/interface"
import { ITeamData, IUiHistoryData } from "./interface"

export const getTeamDataByTeamID = async (teamID: string) => {
  return await teamDataDataBase.getItem<ITeamData>(teamID)
}

export const setTeamDataByTeamID = (teamID: string, teamData: ITeamData) => {
  teamDataDataBase.setItem(teamID, teamData)
}

export const getUiHistoryDataByTabID = async (
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

export const getFormDataByTabID = async (teamID: string, tabID: string) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  return uiHistoryData.formData
}

export const setFormDataByTabID = async (
  teamID: string,
  tabID: string,
  formData: unknown,
) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUiHistoryData = klona(uiHistoryData ?? {})
  newUiHistoryData.formData = formData
  await setUiHistoryData(teamID, tabID, newUiHistoryData)
}

export const deleteFormDataByTabID = async (teamID: string, tabID: string) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUiHistoryData = klona(uiHistoryData ?? {})
  delete newUiHistoryData.formData
  await setUiHistoryData(teamID, tabID, newUiHistoryData)
}

export const deleteUiHistoryData = async (teamID: string, tabID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  if (!newTeamData.uiHistory || !newTeamData.uiHistory[tabID]) return
  delete newTeamData.uiHistory[tabID]
  setTeamDataByTeamID(teamID, newTeamData)
}

export const updateUiHistoryData = async (
  teamID: string,
  oldTabID: string,
  newTabID: string,
  uiHistoryData: IUiHistoryData,
) => {
  const oldData = await getUiHistoryDataByTabID(teamID, oldTabID)
  await setUiHistoryData(teamID, newTabID, { ...oldData, ...uiHistoryData })
  await deleteUiHistoryData(teamID, oldTabID)
}

export const changeUIHistoryKey = async (
  teamID: string,
  oldTabID: string,
  newTabID: string,
) => {
  const oldData = await getUiHistoryDataByTabID(teamID, oldTabID)
  await setUiHistoryData(teamID, newTabID, oldData)
  await deleteUiHistoryData(teamID, oldTabID)
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

export const getTargetTab = async (teamID: string, tabID: string) => {
  const tabs = await getTabs(teamID)
  return tabs.find((tab) => tab.tabID === tabID)
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

export const removeTabsAndCacheData = async (teamID: string, tabID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return
  const tabs = teamData.tabsInfo ?? []
  const targetTab = tabs.find((tab) => tab.tabID === tabID)
  if (!targetTab) return
  const cacheUIHistory = teamData.uiHistory ?? {}
  delete cacheUIHistory[tabID]
  const newTabs = tabs.filter((tab) => tab.tabID !== tabID)
  const newTeamData = klona(teamData)
  newTeamData.tabsInfo = newTabs
  newTeamData.uiHistory = cacheUIHistory
  setTeamDataByTeamID(teamID, newTeamData)
}

export const removeAllTabsAndCacheData = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return
  const newTeamData = klona(teamData)
  const defaultCache = teamData.uiHistory?.[DEFAULT_CHAT_ID] ?? {}
  newTeamData.tabsInfo = INIT_TABS
  newTeamData.uiHistory = {
    [DEFAULT_CHAT_ID]: defaultCache,
  }
  setTeamDataByTeamID(teamID, newTeamData)
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

export const batchUpdateTabs = async (
  teamID: string,
  oldTabIDMapTabInfos: Record<string, Partial<ITabInfo>>,
) => {
  const tabs = await getTabs(teamID)
  const newTabs = tabs.map((tab) => {
    if (oldTabIDMapTabInfos[tab.tabID]) {
      return {
        ...tab,
        ...oldTabIDMapTabInfos[tab.tabID],
      }
    }
    return tab
  })
  await setTabs(teamID, newTabs)
}

// dashboard cache
export const getCacheUIState = async (teamID: string, tabID: string) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  return uiHistoryCacheData.uiState
}
export const setCacheUIState = async (
  teamID: string,
  tabID: string,
  uiState: unknown,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.uiState = uiState
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const getChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const chatMessageData = uiHistoryCacheData.chatMessage ?? []
  const uiChatMessage = uiHistoryCacheData.uiState ?? []

  return { chatMessageData, uiChatMessage }
}

export const setChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
  uiChatMessage: (IGroupMessage | ChatMessage)[],
  chatMessageData: unknown[],
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.chatMessage = chatMessageData
  newUIHistoryCacheData.uiState = uiChatMessage
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const removeChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.chatMessage = []
  newUIHistoryCacheData.uiState = []
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}
