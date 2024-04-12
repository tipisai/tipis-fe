import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import store from "@/redux/store"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import {
  addTabs,
  batchUpdateTabs,
  getTabs,
  removeAllTabsAndCacheData,
  removeTabsAndCacheData,
  updateTabs,
} from "../localForage/teamData"

export const useAddRecentTabReducer = () => {
  const dispatch = useDispatch()

  const addRecentTabReducer = useCallback(
    async (tabInfo: ITabInfo) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.addRecentTabReducer(tabInfo))
      await addTabs(teamID, tabInfo)
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
      await removeTabsAndCacheData(teamID, tabID)
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
    await removeAllTabsAndCacheData(teamID)
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
      await updateTabs(teamID, oldTabID, newTabInfo)
    },
    [dispatch],
  )

  return updateRecentTabReducer
}

export const useBatchUpdateRecentTabReducer = () => {
  const dispatch = useDispatch()

  const batchUpdateRecentTabReducer = useCallback(
    async (oldTabIDMapNewInfos: { [oldTabID: string]: Partial<ITabInfo> }) => {
      const teamID = getCurrentId(store.getState())!

      dispatch(
        recentTabActions.batchUpdateRecentTabReducer(oldTabIDMapNewInfos),
      )
      await batchUpdateTabs(teamID, oldTabIDMapNewInfos)
    },
    [dispatch],
  )

  return batchUpdateRecentTabReducer
}

export const useInitRecentTab = () => {
  const dispatch = useDispatch()
  const currentTeamID = useSelector(getCurrentId)
  const initRecentTab = useCallback(async () => {
    const tabsInfo = await getTabs(currentTeamID!)
    dispatch(recentTabActions.initRecentTabReducer(tabsInfo))
    dispatch(recentTabActions.updateCurrentRecentTabIDReducer(DEFAULT_CHAT_ID))
  }, [currentTeamID, dispatch])

  useEffect(() => {
    initRecentTab()
  }, [initRecentTab])
}
