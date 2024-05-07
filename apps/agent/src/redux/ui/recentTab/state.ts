import { IRecentTabState } from "./interface"

export const DEFAULT_CHAT_ID = "DEFAULT_CHAT"

export const recentTabInitState: IRecentTabState = {
  currentTabID: DEFAULT_CHAT_ID,
  tabs: [],
}
