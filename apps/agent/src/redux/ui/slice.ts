import { combineReducers } from "@reduxjs/toolkit"
import pinedTipisReducer from "./pinedTipis/slice"
import recentTabReducer from "./recentTab/slice"

export const uiReducer = combineReducers({
  recentTab: recentTabReducer,
  pinedTipis: pinedTipisReducer,
})
