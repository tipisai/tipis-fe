import { IRecentTabState, ITabInfo, TAB_TYPE } from "./interface"

export const DEFAULT_CHAT_ID = "DEFAULT_CHAT"

export const INIT_TABS: ITabInfo[] = [
  {
    tabName: "",
    tabIcon: "",
    tabType: TAB_TYPE.CHAT,
    tabID: DEFAULT_CHAT_ID,
    cacheID: DEFAULT_CHAT_ID,
  },
]

export const recentTabInitState: IRecentTabState = {
  currentTabID: DEFAULT_CHAT_ID,
  tabs: INIT_TABS,
}
