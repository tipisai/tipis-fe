import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentId, useGetUserInfoQuery } from "@illa-public/user-data"
import store from "@/redux/store"
import { IPinedTipiTabInfo } from "@/redux/ui/pinedTipis/interface"
import { pinedTipisActions } from "@/redux/ui/pinedTipis/slice"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import {
  addRecentTabs,
  batchUpdateRecentTabs,
  removeAllRecentTabsAndCacheData,
  removeRecentTabsAndCacheData,
  removeRecentTabsAndCacheDataByCacheID,
  setRecentTabs,
} from "../localForage/recentTab"
import { getRecentTabInfosAndPinedTabInfos } from "../localForage/teamData"

export const useAddRecentTabReducer = () => {
  const dispatch = useDispatch()

  const addRecentTabReducer = useCallback(
    async (tabInfo: ITabInfo) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.addRecentTabReducer(tabInfo))
      await addRecentTabs(teamID, tabInfo)
    },
    [dispatch],
  )

  return addRecentTabReducer
}

export const useRemoveRecentTabReducer = () => {
  const dispatch = useDispatch()

  const removeRecentTabReducer = useCallback(
    async (tabID: string) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.deleteRecentTabReducer(tabID))
      await removeRecentTabsAndCacheData(teamID, tabID)
    },
    [dispatch],
  )

  return removeRecentTabReducer
}

export const useRemoveRecentTabByCacheIDReducer = () => {
  const dispatch = useDispatch()

  const removeRecentTabReducer = useCallback(
    async (cacheID: string) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.deleteRecentTabByCacheIDReducer(cacheID))
      await removeRecentTabsAndCacheDataByCacheID(teamID, cacheID)
    },
    [dispatch],
  )

  return removeRecentTabReducer
}

export const useRemoveAllRecentTabReducer = () => {
  const dispatch = useDispatch()

  const removeAllRecentTabReducer = useCallback(async () => {
    const teamID = getCurrentId(store.getState())!
    dispatch(recentTabActions.deleteAllRecentTabReducer())
    await removeAllRecentTabsAndCacheData(teamID)
  }, [dispatch])

  return removeAllRecentTabReducer
}

export const useUpdateRecentTabReducer = () => {
  const dispatch = useDispatch()

  const updateRecentTabReducer = useCallback(
    async (oldTabID: string, newTabInfo: Partial<ITabInfo>) => {
      const teamID = getCurrentId(store.getState())!

      dispatch(
        recentTabActions.updateRecentTabReducer({
          oldTabID,
          newTabInfo,
        }),
      )
      await batchUpdateRecentTabs(teamID, { [oldTabID]: newTabInfo })
    },
    [dispatch],
  )

  return updateRecentTabReducer
}

export const useUpdateRecentTabOrderReducer = () => {
  const dispatch = useDispatch()

  const updateRecentTabOrderReducer = useCallback(
    async (newOrder: string[]) => {
      const teamID = getCurrentId(store.getState())!
      const oldOrderTabInfos = getRecentTabInfos(store.getState())
      const newTabs = newOrder.map((tabID) => {
        return oldOrderTabInfos.find((tab) => tab.tabID === tabID)!
      })

      dispatch(recentTabActions.setRecentTabReducer(newTabs))
      await setRecentTabs(teamID, newTabs)
      // await updateTabs(teamID, oldTabID, newTabInfo)
    },
    [dispatch],
  )

  return updateRecentTabOrderReducer
}

export const useBatchUpdateRecentTabReducer = () => {
  const dispatch = useDispatch()

  const batchUpdateRecentTabReducer = useCallback(
    async (oldTabIDMapNewInfos: { [oldTabID: string]: Partial<ITabInfo> }) => {
      const teamID = getCurrentId(store.getState())!

      dispatch(
        recentTabActions.batchUpdateRecentTabReducer(oldTabIDMapNewInfos),
      )
      await batchUpdateRecentTabs(teamID, oldTabIDMapNewInfos)
    },
    [dispatch],
  )

  return batchUpdateRecentTabReducer
}

export const useInitRecentTab = () => {
  const dispatch = useDispatch()
  const currentTeamID = useSelector(getCurrentId)
  const { data } = useGetUserInfoQuery(null)

  const initRecentTab = useCallback(async () => {
    if (!data || !currentTeamID) return
    const { recentTabInfos } = await getRecentTabInfosAndPinedTabInfos(
      currentTeamID!,
    )

    const serverPinedTabInfos =
      (data?.personalization?.pinedTipisTabs as Record<
        string,
        IPinedTipiTabInfo[]
      >) || {}
    const currentTeamServerPinedTabInfos =
      serverPinedTabInfos[currentTeamID] ?? []
    dispatch(
      pinedTipisActions.setPinedTipiTabReducer(currentTeamServerPinedTabInfos),
    )
    dispatch(recentTabActions.setRecentTabReducer(recentTabInfos))
    dispatch(recentTabActions.updateCurrentRecentTabIDReducer(DEFAULT_CHAT_ID))
  }, [currentTeamID, data, dispatch])

  useEffect(() => {
    initRecentTab()
  }, [initRecentTab])
}

export const useFindRecentTabByTabID = () => {
  const recentTabs = useSelector(getRecentTabInfos)
  const findRecentTabByID = useCallback(
    (tabID: string) => {
      return recentTabs.find((tab) => tab.tabID === tabID)
    },
    [recentTabs],
  )

  return findRecentTabByID
}
