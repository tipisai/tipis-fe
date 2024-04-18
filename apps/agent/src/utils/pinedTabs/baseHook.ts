import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import store from "@/redux/store"
import { IPinedTipiTabInfo } from "@/redux/ui/pinedTipis/interface"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import { pinedTipisActions } from "@/redux/ui/pinedTipis/slice"
import {
  addPinedTipisTabs,
  batchUpdatePinedTipisTabs,
  removePinedTipisTabsByTipisID,
  setPinedTipisTabs,
} from "../localForage/pinedTipisTab"

export const useAddPinedTipiTabReducer = () => {
  const dispatch = useDispatch()

  const addPinedTipiTabReducer = useCallback(
    async (pinedTipisInfo: IPinedTipiTabInfo) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(pinedTipisActions.addPinedTipiTabReducer(pinedTipisInfo))
      await addPinedTipisTabs(teamID, pinedTipisInfo)
    },
    [dispatch],
  )

  return addPinedTipiTabReducer
}

export const useRemovePinedTipiTabByTipiIDReducer = () => {
  const dispatch = useDispatch()

  const removePinedTipiTabReducer = useCallback(
    async (tipisID: string) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(pinedTipisActions.removePinedTipiTabByTipisIDReducer(tipisID))
      await removePinedTipisTabsByTipisID(teamID, tipisID)
    },
    [dispatch],
  )

  return removePinedTipiTabReducer
}

export const useUpdatePinedTipiTabReducer = () => {
  const dispatch = useDispatch()

  const updatePinedTipiTabReducer = useCallback(
    async (
      oldTipiID: string,
      newPinedTipisInfo: Partial<IPinedTipiTabInfo>,
    ) => {
      const teamID = getCurrentId(store.getState())!

      dispatch(
        pinedTipisActions.updatePinedTipiTabByTipisIDReducer({
          [oldTipiID]: newPinedTipisInfo,
        }),
      )
      await batchUpdatePinedTipisTabs(teamID, {
        [oldTipiID]: newPinedTipisInfo,
      })
    },
    [dispatch],
  )

  return updatePinedTipiTabReducer
}

export const useUpdatePinedTipiTabOrderReducer = () => {
  const dispatch = useDispatch()

  const updatePinedTipiTabOrderReducer = useCallback(
    async (newOrder: string[]) => {
      const teamID = getCurrentId(store.getState())!
      const oldOrderTabInfos = getPinedTipis(store.getState())
      const newTabs = newOrder.map((tabID) => {
        return oldOrderTabInfos.find((tab) => tab.tabID === tabID)!
      })

      dispatch(pinedTipisActions.setPinedTipiTabReducer(newTabs))
      await setPinedTipisTabs(teamID, newTabs)
    },
    [dispatch],
  )

  return updatePinedTipiTabOrderReducer
}
