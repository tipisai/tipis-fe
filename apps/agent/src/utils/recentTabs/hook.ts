import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import store from "../../redux/store"
import { ITabInfo, TAB_TYPE } from "../../redux/ui/recentTab/interface"
import {
  getExploreTipisTab,
  getRecentTabInfos,
} from "../../redux/ui/recentTab/selector"
import { recentTabActions } from "../../redux/ui/recentTab/slice"
import {
  getCreateTipiPath,
  getEditTipiPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
  getTipiDetailPath,
} from "../routeHelper"

export const useCreateTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createTip = useCallback(() => {
    const historyTabs = getRecentTabInfos(store.getState())
    const createTipisTab = historyTabs.find(
      (tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS,
    )
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    if (!createTipisTab) {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.CREATE_TIPIS,
        tabID: tempID,
        cacheID: tempID,
      }
      dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
      navigate(getCreateTipiPath(currentTeamInfo?.identifier, tempID))
    } else {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(createTipisTab.tabID),
      )
      navigate(
        getCreateTipiPath(currentTeamInfo?.identifier, createTipisTab.cacheID),
      )
    }
  }, [dispatch, navigate])

  return createTip
}

export const useEditTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const editTipis = useCallback(
    (tipisID: string) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      let currentTab = historyTabs.find(
        (tab) => tab.cacheID === tipisID && tab.tabType === TAB_TYPE.EDIT_TIPIS,
      )
      if (!currentTab) {
        currentTab = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.EDIT_TIPIS,
          tabID: v4(),
          cacheID: tipisID,
        }
        dispatch(recentTabActions.addRecentTabReducer(currentTab))
      }

      navigate(getEditTipiPath(currentTeamInfo.identifier, tipisID))
    },
    [dispatch, navigate],
  )

  return editTipis
}

export const useRunTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const runTipis = useCallback(
    (tipisID: string) => {
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const tabID = v4()

      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.RUN_TIPIS,
        tabID: tabID,
        cacheID: tipisID,
      }
      dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
      navigate(
        `${getRunTipiPath(currentTeamInfo.identifier, tipisID)}/${tabID}`,
      )
    },
    [dispatch, navigate],
  )

  return runTipis
}

export const useDetailTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const detailTipis = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      const { tipisID, title, tabIcon } = tabInfo
      const exploreTipiTab = getExploreTipisTab(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const newTab = {
        tabName: title,
        tabIcon: tabIcon,
        tabType: TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        tabID: v4(),
        cacheID: tipisID,
      }
      if (exploreTipiTab) {
        dispatch(
          recentTabActions.updateRecentTabReducer({
            oldTabID: exploreTipiTab.tabID,
            newTabInfo: newTab,
          }),
        )
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
      } else {
        const recentTabs = getRecentTabInfos(store.getState())
        const currentTipiTab = recentTabs.find(
          (tab) =>
            tab.cacheID === tipisID &&
            tab.tabType === TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        )
        if (!currentTipiTab) {
          dispatch(recentTabActions.addRecentTabReducer(newTab))
        }
      }
      navigate(getTipiDetailPath(currentTeamInfo.identifier, tipisID))
    },
    [dispatch, navigate],
  )

  return detailTipis
}

export const useMarketDetailTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const detailTipis = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      const { tipisID, title, tabIcon } = tabInfo
      const exploreTipiTab = getExploreTipisTab(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const newTab = {
        tabName: title,
        tabIcon: tabIcon,
        tabType: TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL,
        tabID: v4(),
        cacheID: tipisID,
      }
      if (exploreTipiTab) {
        dispatch(
          recentTabActions.updateRecentTabReducer({
            oldTabID: exploreTipiTab.tabID,
            newTabInfo: newTab,
          }),
        )
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
      } else {
        const recentTabs = getRecentTabInfos(store.getState())
        const currentTipiTab = recentTabs.find(
          (tab) =>
            tab.cacheID === tipisID &&
            tab.tabType === TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL,
        )
        if (!currentTipiTab) {
          dispatch(recentTabActions.addRecentTabReducer(newTab))
        }
      }

      navigate(getMarketTipiDetailPath(currentTeamInfo.identifier, tipisID))
    },
    [dispatch, navigate],
  )

  return detailTipis
}

export const useRunMarketTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const runTipis = useCallback(
    (tipisID: string, ownerTeamIdentifier: string) => {
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const tabID = v4()

      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.RUN_TIPIS,
        tabID: tabID,
        cacheID: tipisID,
      }
      dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
      navigate(
        `${getRunTipiPath(ownerTeamIdentifier, tipisID)}/${tabID}?myTeamIdentifier=${currentTeamInfo.identifier}`,
      )
    },
    [dispatch, navigate],
  )

  return runTipis
}
