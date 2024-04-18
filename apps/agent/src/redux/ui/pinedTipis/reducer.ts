import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { IPinedTipiTabInfo, TPinedTipisTabState } from "./interface"

export const addPinedTipiTab: CaseReducer<
  TPinedTipisTabState,
  PayloadAction<IPinedTipiTabInfo>
> = (state, action) => {
  state = [action.payload, ...state]
  return state
}
