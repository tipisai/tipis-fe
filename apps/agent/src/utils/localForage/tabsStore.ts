import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { tabStore } from "."
import { deleteUiHistoryData } from "./uiHistoryStore"

export const TABS_KEY = "tabs"
export const getTabs = async () => {
  return ((await tabStore.getItem(TABS_KEY)) ?? []) as ITabInfo[]
}

export const setTabs = async (tabInfos: ITabInfo[]) => {
  tabStore.setItem(TABS_KEY, tabInfos)
}

export const removeTabs = async (tabID: string) => {
  const tabs = await getTabs()
  const targetTab = tabs.find((tab) => tab.tabID === tabID)
  if (!targetTab) return
  const cacheID = targetTab.cacheID
  deleteUiHistoryData(cacheID)
  const newTabs = tabs.filter((tab) => tab.tabID !== tabID)
  setTabs(newTabs)
}
