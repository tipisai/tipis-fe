import { useCallback } from "react"
import { v4 } from "uuid"
import store from "@/redux/store"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import {
  useAddPinedTipiTabReducer,
  useRemovePinedTipiTabByTipiIDReducer,
} from "./baseHook"

export const usePinOrUnpinTipis = () => {
  const addPinedTipis = useAddPinedTipiTabReducer()
  const removePinedTipiByTipisID = useRemovePinedTipiTabByTipiIDReducer()

  const pinOrUnpinTipis = useCallback(
    async (tipiInfo: {
      tipiID: string
      tipiName: string
      tipiIcon: string
      tipiOwnerTeamIdentity: string
    }) => {
      const { tipiID, tipiName, tipiIcon, tipiOwnerTeamIdentity } = tipiInfo
      const pinedTipisInfo = getPinedTipisByTipisID(store.getState(), tipiID)
      if (pinedTipisInfo) {
        await removePinedTipiByTipisID(tipiID)
      } else {
        await addPinedTipis({
          tabID: v4(),
          tabName: tipiName,
          tabIcon: tipiIcon,
          tipiID,
          tipiOwnerTeamIdentity,
        })
      }
    },
    [addPinedTipis, removePinedTipiByTipisID],
  )

  return pinOrUnpinTipis
}
