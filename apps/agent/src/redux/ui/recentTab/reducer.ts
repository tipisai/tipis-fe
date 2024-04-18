import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { IRecentTabState, ITabInfo } from "./interface"
import { DEFAULT_CHAT_ID, INIT_TABS } from "./state"

export const setRecentTabReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<ITabInfo[]>
> = (state, action) => {
  state.tabs = action.payload
}

export const addRecentTabReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<ITabInfo>
> = (state, action) => {
  const newTabs = [action.payload, ...state.tabs]
  state.tabs = newTabs
  state.currentTabID = action.payload.tabID
}

export const deleteRecentTabReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<string>
> = (state, action) => {
  const index = state.tabs.findIndex((tab) => tab.tabID === action.payload)
  if (index === -1) return
  const newTabs = state.tabs.filter((tab) => tab.tabID !== action.payload)
  state.tabs = newTabs
  if (state.currentTabID === action.payload) {
    state.currentTabID = ""
  }
  if (newTabs.length > 0) {
    if (index >= newTabs.length - 1) {
      state.currentTabID = newTabs[newTabs.length - 1].tabID
    } else if (index === 0) {
      state.currentTabID = newTabs[0].tabID
    } else {
      state.currentTabID = newTabs[index - 1].tabID
    }
  }
}

export const deleteRecentTabByTipisIDReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<string>
> = (state, action) => {
  const index = state.tabs.findIndex((tab) => tab.cacheID === action.payload)
  if (index === -1) return
  const newTabs = state.tabs.filter((tab) => tab.cacheID !== action.payload)
  state.tabs = newTabs
  const notHasCurrentTabID =
    newTabs.map((tab) => tab.tabID).indexOf(state.currentTabID) === -1
  if (notHasCurrentTabID) {
    state.currentTabID = ""
  }
  if (newTabs.length > 0) {
    if (index >= newTabs.length - 1) {
      state.currentTabID = newTabs[newTabs.length - 1].tabID
    } else if (index === 0) {
      state.currentTabID = newTabs[0].tabID
    } else {
      state.currentTabID = newTabs[index - 1].tabID
    }
  }
}

export const deleteAllRecentTabReducer: CaseReducer<IRecentTabState> = (
  state,
) => {
  state.tabs = INIT_TABS
  state.currentTabID = DEFAULT_CHAT_ID
}

export const updateRecentTabReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<{
    oldTabID: string
    newTabInfo: Partial<ITabInfo>
  }>
> = (state, action) => {
  const newTabs = [...state.tabs].map((tab) => {
    if (tab.tabID === action.payload.oldTabID) {
      return {
        ...tab,
        ...action.payload.newTabInfo,
      }
    }
    return tab
  })

  state.tabs = newTabs
}

export const batchUpdateRecentTabReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<{
    [oldTabID: string]: Partial<ITabInfo>
  }>
> = (state, action) => {
  const newTabs = [...state.tabs].map((tab) => {
    if (action.payload[tab.tabID]) {
      return {
        ...tab,
        ...action.payload[tab.tabID],
      }
    }
    return tab
  })

  state.tabs = newTabs
}

export const updateCurrentRecentTabIDReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<string>
> = (state, action) => {
  state.currentTabID = action.payload
}

export const updateCurrentRecentTabOrderReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<string[]>
> = (state, action) => {
  const newIDSortOrder = action.payload

  const newTabs = newIDSortOrder.map((tabID) => {
    return state.tabs.find((tab) => tab.tabID === tabID)!
  })

  state.tabs = newTabs
}
