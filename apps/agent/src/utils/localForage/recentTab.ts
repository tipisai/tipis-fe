import { klona } from "klona/json"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { DEFAULT_CHAT_ID, INIT_TABS } from "@/redux/ui/recentTab/state"
import { ITeamData } from "./interface"
import { getTeamDataByTeamID, setTeamDataByTeamID } from "./teamData"

export const getRecentTabs = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) {
    await setRecentTabs(teamID, INIT_TABS)
    return INIT_TABS
  }
  const tabsInfo = teamData.tabsInfo ?? INIT_TABS
  return tabsInfo
}

export const setRecentTabs = async (teamID: string, tabInfos: ITabInfo[]) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  newTeamData.tabsInfo = tabInfos
  setTeamDataByTeamID(teamID, newTeamData)
}

export const addRecentTabs = async (teamID: string, tabInfo: ITabInfo) => {
  const tabs = await getRecentTabs(teamID)
  const newTabs = [tabInfo, ...tabs]
  await setRecentTabs(teamID, newTabs)
}

export const removeRecentTabsAndCacheData = async (
  teamID: string,
  tabID: string,
) => {
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

export const removeRecentTabsAndCacheDataByCacheID = async (
  teamID: string,
  cacheID: string,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return
  const tabs = teamData.tabsInfo ?? []
  const targetTabs = tabs.filter((tab) => tab.cacheID === cacheID)
  if (targetTabs.length === 0) return
  const cacheUIHistory = teamData.uiHistory ?? {}
  targetTabs.forEach((tab) => {
    delete cacheUIHistory[tab.tabID]
  })
  const newTabs = tabs.filter((tab) => tab.cacheID !== cacheID)
  const newTeamData = klona(teamData)
  newTeamData.tabsInfo = newTabs
  newTeamData.uiHistory = cacheUIHistory
  setTeamDataByTeamID(teamID, newTeamData)
}

export const removeAllRecentTabsAndCacheData = async (teamID: string) => {
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

export const batchUpdateRecentTabs = async (
  teamID: string,
  oldTabIDMapTabInfos: Record<string, Partial<ITabInfo>>,
) => {
  const tabs = await getRecentTabs(teamID)
  const newTabs = tabs.map((tab) => {
    if (oldTabIDMapTabInfos[tab.tabID]) {
      return {
        ...tab,
        ...oldTabIDMapTabInfos[tab.tabID],
      }
    }
    return tab
  })
  await setRecentTabs(teamID, newTabs)
}
