import { createSlice } from "@reduxjs/toolkit"
import {
  addRecentTabReducer,
  deleteAllRecentTabReducer,
  deleteRecentTabReducer,
  initRecentTabReducer,
  updateCurrentRecentTabIDReducer,
  updateRecentTabReducer,
} from "./reducer"
import { recentTabInitState } from "./state"

const recentTabSlice = createSlice({
  name: "recentTab",
  initialState: recentTabInitState,
  reducers: {
    initRecentTabReducer,
    addRecentTabReducer,
    deleteRecentTabReducer,
    deleteAllRecentTabReducer,
    updateRecentTabReducer,
    updateCurrentRecentTabIDReducer,
  },
})

export const recentTabActions = recentTabSlice.actions
export default recentTabSlice.reducer
