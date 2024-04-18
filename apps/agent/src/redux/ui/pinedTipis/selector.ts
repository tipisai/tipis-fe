import { createSelector } from "@reduxjs/toolkit"
import { getUI } from "../selector"

export const getPinedTipis = createSelector(
  [getUI],
  (uiState) => uiState.pinedTipis,
)

export const getPinedTipisByTipisID = createSelector(
  [(state, id: string) => id, getPinedTipis],
  (id, tipis) => {
    return tipis.find((tipi) => tipi.tipiID === id)
  },
)

export const getPinedTipisOrder = createSelector([getPinedTipis], (tipisInfo) =>
  tipisInfo.map((tipi) => tipi.tabID),
)
