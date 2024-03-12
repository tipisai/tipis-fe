import { createSlice } from "@reduxjs/toolkit"
import {
  addRecentTabReducer,
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
    updateRecentTabReducer,
    updateCurrentRecentTabIDReducer,
  },
})

export const recentTabActions = recentTabSlice.actions
export default recentTabSlice.reducer
