import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { removeTabs, setTabs } from "@/utils/localForage/tabsStore"
import { IRecentTabState, ITabInfo } from "./interface"

export const initRecentTabReducer: CaseReducer<
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
  setTabs(newTabs)
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
  removeTabs(action.payload)
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

  setTabs(newTabs)
}

export const updateCurrentRecentTabIDReducer: CaseReducer<
  IRecentTabState,
  PayloadAction<string>
> = (state, action) => {
  state.currentTabID = action.payload
}
