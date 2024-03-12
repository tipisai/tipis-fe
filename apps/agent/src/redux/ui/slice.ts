import { combineReducers } from "@reduxjs/toolkit"
import recentTabReducer from "./recentTab/slice"

export const uiReducer = combineReducers({
  recentTab: recentTabReducer,
})
