import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import {
  IPinedTipiTabInfo,
  IUpdatePinedTipiTabByTipisIDPayload,
  TPinedTipisTabState,
} from "./interface"

export const setPinedTipiTabReducer: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<IPinedTipiTabInfo[]>
> = (state, action) => {
  return action.payload
}

export const addPinedTipiTabReducer: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<IPinedTipiTabInfo>
> = (state, action) => {
  state = [action.payload, ...state]
  return state
}

export const removePinedTipiTabByTabIDReducer: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<string>
> = (state, action) => {
  return state.filter((tab) => tab.tabID !== action.payload)
}

export const removePinedTipiTabByTipisIDReducer: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<string>
> = (state, action) => {
  return state.filter((tab) => tab.tipiID !== action.payload)
}

export const updatePinedTipiTabByTipisIDReducer: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<IUpdatePinedTipiTabByTipisIDPayload>
> = (state, action) => {
  return state.map((tab) => {
    if (action.payload[tab.tipiID]) {
      return {
        ...tab,
        ...action.payload[tab.tipiID],
      }
    }
    return tab
  })
}
