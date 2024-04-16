import { createSelector } from "@reduxjs/toolkit"
import { getUI } from "../selector"
import { TAB_TYPE } from "./interface"

export const getRecentTab = createSelector(
  [getUI],
  (uiState) => uiState.recentTab,
)

export const getCurrentTabID = createSelector(
  [getRecentTab],
  (recentTabState) => {
    return recentTabState.currentTabID
  },
)

export const getRecentTabInfos = createSelector(
  [getRecentTab],
  (recentTabState) => {
    return recentTabState.tabs
  },
)

export const getRecentTabInfosOrder = createSelector(
  [getRecentTabInfos],
  (tabs) => tabs.map((tab) => tab.tabID),
)

export const getRecentTabInfosByID = createSelector(
  [(state, id: string) => id, getRecentTabInfos],
  (id, tabs) => {
    return tabs.find((tab) => tab.tabID === id)
  },
)

export const getCurrentTabInfo = createSelector(
  [getCurrentTabID, getRecentTabInfos],
  (currentTabID, recentTabs) => {
    return recentTabs.find((tab) => tab.tabID === currentTabID)
  },
)

export const getCreateTipsTab = createSelector(
  [getRecentTabInfos],
  (recentTabs) => {
    return recentTabs.find((tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS)
  },
)

export const getExploreTipisTab = createSelector(
  [getRecentTabInfos],
  (recentTabs) => {
    return recentTabs.find(
      (tab) =>
        tab.tabType === TAB_TYPE.EXPLORE_TIPIS ||
        tab.tabType === TAB_TYPE.EXPLORE_TIPIS_DETAIL ||
        tab.tabType === TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL,
    )
  },
)

export const getExploreFunctionTab = createSelector(
  [getRecentTabInfos],
  (recentTabs) => {
    return recentTabs.find(
      (tab) =>
        tab.tabType === TAB_TYPE.EXPLORE_FUNCTION ||
        tab.tabType === TAB_TYPE.EXPLORE_FUNCTION_DETAIL ||
        tab.tabType === TAB_TYPE.EXPLORE_MARKET_FUNCTION_DETAIL,
    )
  },
)
