import { klona } from "klona/json"
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
  return targetCacheID
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
  setUiHistoryData(teamID, newCacheID, { ...oldData, ...uiHistoryData })
  deleteUiHistoryData(teamID, oldCacheID)
}

export const getTabs = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) {
    setTabs(teamID, INIT_TABS)
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
  setTabs(teamID, newTabs)
}

export const removeTabs = async (teamID: string, tabID: string) => {
  const tabs = await getTabs(teamID)
  const targetTab = tabs.find((tab) => tab.tabID === tabID)
  if (!targetTab) return
  const cacheID = targetTab.cacheID
  deleteUiHistoryData(teamID, cacheID)
  const newTabs = tabs.filter((tab) => tab.tabID !== tabID)
  setTabs(teamID, newTabs)
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
  setTabs(teamID, newTabs)
}
