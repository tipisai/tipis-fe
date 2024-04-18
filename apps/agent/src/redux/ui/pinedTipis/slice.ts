import { createSlice } from "@reduxjs/toolkit"
import { addPinedTipiTab } from "./reducer"
import { pinedTipisState } from "./state"

const pinedTipisSlice = createSlice({
  name: "pinedTipis",
  initialState: pinedTipisState,
  reducers: {
    addPinedTipiTab,
  },
})

export const pinedTipisActions = pinedTipisSlice.actions
export default pinedTipisSlice.reducer
