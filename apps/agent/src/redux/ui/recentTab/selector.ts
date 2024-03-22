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

export const getCreateTipsTab = createSelector(
  [getRecentTabInfos],
  (recentTabs) => {
    return recentTabs.find((tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS)
  },
)

export const getExploreTipisTab = createSelector(
  [getRecentTabInfos],
  (recentTabs) => {
    return recentTabs.find((tab) => tab.tabType === TAB_TYPE.EXPLORE_TIPIS)
  },
)
