import { createSlice } from "@reduxjs/toolkit"
import {
  addPinedTipiTabReducer,
  removePinedTipiTabByTabIDReducer,
  removePinedTipiTabByTipisIDReducer,
  setPinedTipiTabReducer,
  updatePinedTipiTabByTipisIDReducer,
} from "./reducer"
import { pinedTipisState } from "./state"

const pinedTipisSlice = createSlice({
  name: "pinedTipis",
  initialState: pinedTipisState,
  reducers: {
    setPinedTipiTabReducer,
    addPinedTipiTabReducer,
    removePinedTipiTabByTabIDReducer,
    removePinedTipiTabByTipisIDReducer,
    updatePinedTipiTabByTipisIDReducer,
  },
})

export const pinedTipisActions = pinedTipisSlice.actions
export default pinedTipisSlice.reducer
