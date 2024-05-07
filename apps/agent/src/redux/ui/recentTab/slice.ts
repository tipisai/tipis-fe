import { createSlice } from "@reduxjs/toolkit"
import {
  addRecentTabReducer,
  batchUpdateRecentTabReducer,
  deleteAllRecentTabReducer,
  deleteRecentTabByCacheIDReducer,
  deleteRecentTabReducer,
  setRecentTabReducer,
  updateCurrentRecentTabIDReducer,
  updateCurrentRecentTabOrderReducer,
  updateRecentTabReducer,
} from "./reducer"
import { recentTabInitState } from "./state"

const recentTabSlice = createSlice({
  name: "recentTab",
  initialState: recentTabInitState,
  reducers: {
    setRecentTabReducer,
    addRecentTabReducer,
    deleteRecentTabReducer,
    deleteAllRecentTabReducer,
    deleteRecentTabByCacheIDReducer,
    updateRecentTabReducer,
    updateCurrentRecentTabIDReducer,
    batchUpdateRecentTabReducer,
    updateCurrentRecentTabOrderReducer,
  },
})

export const recentTabActions = recentTabSlice.actions
export default recentTabSlice.reducer
