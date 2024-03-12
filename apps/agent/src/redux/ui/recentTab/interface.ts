export enum TAB_TYPE {
  "CREATE_TIPIS",
  "EDIT_TIPIS",
  "CHAT",
  "CREATE_FUNCTION",
  "EDIT_FUNCTION",
  "EXPLORE_TIPIS",
  "EXPLORE_FUNCTION",
  "EXPLORE_TIPIS_DETAIL",
  "EXPLORE_FUNCTION_DETAIL",
}

export interface ITabInfo {
  tabName: string
  tabIcon: string
  tabType: TAB_TYPE
  tabID: string
  cacheID: string
}
export interface IRecentTabState {
  currentTabID: string
  tabs: ITabInfo[]
}
