import { klona } from "klona/json"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import {
  getCurrentId,
  useGetTeamsInfoQuery,
  useGetUserInfoQuery,
  useSetPersonalizationMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { IPinedTipiTabInfo } from "@/redux/ui/pinedTipis/interface"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import { pinedTipisActions } from "@/redux/ui/pinedTipis/slice"
import {
  addPinedTipisTabs,
  batchUpdatePinedTipisTabs,
  getTeamIDMapPinedTipisTabs,
  removePinedTipisTabsByTipisID,
  setPinedTipisTabs,
} from "../localForage/pinedTipisTab"

export const useSyncPinedTipisToServer = () => {
  const [setPersonalization] = useSetPersonalizationMutation()
  const { data: userInfo } = useGetUserInfoQuery(null)
  const { data: teamInfos } = useGetTeamsInfoQuery(null)

  const syncPinedTIpisToServer = async () => {
    if (!userInfo || !Array.isArray(teamInfos) || teamInfos.length === 0) return
    const newPersonalization = klona(userInfo.personalization ?? {})
    const ownTeamIDs = teamInfos.map((team) => team.id)
    const teamIDMapPinedTipisTabs = await getTeamIDMapPinedTipisTabs(ownTeamIDs)
    newPersonalization.pinedTipisTabs = teamIDMapPinedTipisTabs
    await setPersonalization(newPersonalization)
  }

  return syncPinedTIpisToServer
}

export const useAddPinedTipiTabReducer = () => {
  const dispatch = useDispatch()
  const syncPinedTipis = useSyncPinedTipisToServer()

  const addPinedTipiTabReducer = useCallback(
    async (pinedTipisInfo: IPinedTipiTabInfo) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(pinedTipisActions.addPinedTipiTabReducer(pinedTipisInfo))
      await addPinedTipisTabs(teamID, pinedTipisInfo)
      await syncPinedTipis()
    },
    [dispatch, syncPinedTipis],
  )

  return addPinedTipiTabReducer
}

export const useRemovePinedTipiTabByTipiIDReducer = () => {
  const dispatch = useDispatch()
  const syncPinedTipis = useSyncPinedTipisToServer()

  const removePinedTipiTabReducer = useCallback(
    async (tipisID: string) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(pinedTipisActions.removePinedTipiTabByTipisIDReducer(tipisID))
      await removePinedTipisTabsByTipisID(teamID, tipisID)
      await syncPinedTipis()
    },
    [dispatch, syncPinedTipis],
  )

  return removePinedTipiTabReducer
}

export const useUpdatePinedTipiTabReducer = () => {
  const dispatch = useDispatch()
  const syncPinedTipis = useSyncPinedTipisToServer()

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
      await syncPinedTipis()
    },
    [dispatch, syncPinedTipis],
  )

  return updatePinedTipiTabReducer
}

export const useUpdatePinedTipiTabOrderReducer = () => {
  const dispatch = useDispatch()
  const syncPinedTipis = useSyncPinedTipisToServer()

  const updatePinedTipiTabOrderReducer = useCallback(
    async (newOrder: string[]) => {
      const teamID = getCurrentId(store.getState())!
      const oldOrderTabInfos = getPinedTipis(store.getState())
      const newTabs = newOrder.map((tabID) => {
        return oldOrderTabInfos.find((tab) => tab.tabID === tabID)!
      })

      dispatch(pinedTipisActions.setPinedTipiTabReducer(newTabs))
      await setPinedTipisTabs(teamID, newTabs)
      await syncPinedTipis()
    },
    [dispatch, syncPinedTipis],
  )

  return updatePinedTipiTabOrderReducer
}
