import { createSelector } from "@reduxjs/toolkit"
import { getUI } from "../selector"

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
