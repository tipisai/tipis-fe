import { tabStore } from "."
import { ITabInfo } from "../../redux/ui/recentTab/interface"

export const TABS_KEY = "tabs"
export const getTabs = async () => {
  return (await tabStore.getItem(TABS_KEY)) as ITabInfo[]
}

export const setTabs = async (tabInfos: ITabInfo[]) => {
  tabStore.setItem(TABS_KEY, tabInfos)
}
