import { createSlice } from "@reduxjs/toolkit"
import { pinedTipisState } from "./state"

const pinedTipisSlice = createSlice({
  name: "pinedTipis",
  initialState: pinedTipisState,
  reducers: {},
})

export const pinedTipisActions = pinedTipisSlice.actions
export default pinedTipisSlice.reducer
