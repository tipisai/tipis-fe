import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import store from "@/redux/store"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import {
  addTabs,
  getTabs,
  removeTabs,
  updateTabs,
} from "../localForage/teamData"

export const useAddRecentTabReducer = () => {
  const dispatch = useDispatch()

  const addRecentTabReducer = useCallback(
    (tabInfo: ITabInfo) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.addRecentTabReducer(tabInfo))
      addTabs(teamID, tabInfo)
    },
    [dispatch],
  )

  return addRecentTabReducer
}

export const useRemoveRecentTabReducer = () => {
  const dispatch = useDispatch()

  const removeRecentTabReducer = useCallback(
    (tabID: string) => {
      const teamID = getCurrentId(store.getState())!
      dispatch(recentTabActions.deleteRecentTabReducer(tabID))
      removeTabs(teamID, tabID)
    },
    [dispatch],
  )

  return removeRecentTabReducer
}

export const useUpdateRecentTabReducer = () => {
  const dispatch = useDispatch()

  const updateRecentTabReducer = useCallback(
    (oldTabID: string, newTabInfo: Partial<ITabInfo>) => {
      const teamID = getCurrentId(store.getState())!

      dispatch(
        recentTabActions.updateRecentTabReducer({
          oldTabID,
          newTabInfo,
        }),
      )
      updateTabs(teamID, oldTabID, newTabInfo)
    },
    [dispatch],
  )

  return updateRecentTabReducer
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
