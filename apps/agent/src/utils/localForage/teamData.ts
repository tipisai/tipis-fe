import { klona } from "klona/json"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { DEFAULT_CHAT_ID, INIT_TABS } from "@/redux/ui/recentTab/state"
import { teamDataDataBase } from "."
import {
  ChatMessage,
  IGroupMessage,
} from "../../components/PreviewChat/interface"
import { IChatUIState, ITeamData, IUiHistoryData } from "./interface"

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
  const cacheID = targetTab.cacheID
  const cacheUIHistory = teamData.uiHistory ?? {}
  delete cacheUIHistory[cacheID]
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

export const getChatMessageAndUIState = async (
  teamID: string,
  cacheID: string,
  mode: "edit" | "run" | "create",
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  const chatMessageData = uiHistoryCacheData.chatMessage?.[mode] ?? []
  const uiChatMessage =
    (uiHistoryCacheData.uiState as IChatUIState)?.[mode] ?? []
  return { chatMessageData, uiChatMessage }
}

export const setChatMessageAndUIState = async (
  teamID: string,
  cacheID: string,
  mode: "edit" | "run" | "create",
  uiChatMessage: (IGroupMessage | ChatMessage)[],
  chatMessageData: unknown[],
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [], create: [] }
  }
  if (!newUIHistoryCacheData.uiState) {
    newUIHistoryCacheData.uiState = {
      edit: [],
      run: [],
    }
  }

  newUIHistoryCacheData.chatMessage[mode] = chatMessageData
  ;(newUIHistoryCacheData.uiState as IChatUIState)[mode] = uiChatMessage

  await setUiHistoryData(teamID, cacheID, newUIHistoryCacheData)
}

export const removeChatMessageAndUIState = async (
  teamID: string,
  cacheID: string,
  mode: "edit" | "run" | "create",
) => {
  const uiHistoryCacheData = await getUiHistoryDataByCacheID(teamID, cacheID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  if (!newUIHistoryCacheData.chatMessage) {
    newUIHistoryCacheData.chatMessage = { edit: [], run: [], create: [] }
  }
  if (!newUIHistoryCacheData.uiState) {
    newUIHistoryCacheData.uiState = {
      edit: [],
      run: [],
      create: [],
    }
  }
  newUIHistoryCacheData.chatMessage[mode] = []
  ;(newUIHistoryCacheData.uiState as IChatUIState)[mode] = []
  await setUiHistoryData(teamID, cacheID, newUIHistoryCacheData)
}
