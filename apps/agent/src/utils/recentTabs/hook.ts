import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import store from "@/redux/store"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getExploreFunctionTab,
  getExploreTipisTab,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import {
  getCreateFunctionPath,
  getEditTipiPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
} from "../routeHelper"
import { useAddRecentTabReducer, useUpdateRecentTabReducer } from "./baseHook"
import {
  CREATE_TIPIS_ID,
  EXPLORE_FUNCTION_ID,
  EXPLORE_TIPIS_ID,
} from "./constants"

export const useAddCreateTipisTab = () => {
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()

  const addCreateTipTab = useCallback(async () => {
    const historyTabs = getRecentTabInfos(store.getState())
    const createTipisTab = historyTabs.find(
      (tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS,
    )
    if (!createTipisTab) {
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.CREATE_TIPIS,
        tabID: CREATE_TIPIS_ID,
        cacheID: CREATE_TIPIS_ID,
      }
      await addRecentTab(tabsInfo)
    } else {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(createTipisTab.tabID),
      )
    }
  }, [addRecentTab, dispatch])

  return addCreateTipTab
}

export const useAddEditTipisTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()

  const addEditTipisTab = useCallback(
    async (tipisID: string) => {
      const historyTabs = getRecentTabInfos(store.getState())

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
        await addRecentTab(currentTab)
      } else {
        dispatch(
          recentTabActions.updateCurrentRecentTabIDReducer(currentTab.tabID),
        )
      }
    },
    [addRecentTab, dispatch],
  )

  return addEditTipisTab
}

export const useAddRunTipisTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()

  const addRunTipisTab = useCallback(
    async (
      tabInfo: {
        tipisID: string
        tipisIcon: string
        tipisName: string
      },
      tabID: string,
    ) => {
      const { tipisID, tipisIcon, tipisName } = tabInfo
      const historyTabs = getRecentTabInfos(store.getState())
      const runTipisTab = historyTabs.find(
        (tab) =>
          tab.tabType === TAB_TYPE.RUN_TIPIS &&
          tab.cacheID === tipisID &&
          tab.tabID === tabID,
      )
      if (runTipisTab) {
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tabID))
      } else {
        const tabsInfo: ITabInfo = {
          tabName: tipisName,
          tabIcon: tipisIcon,
          tabType: TAB_TYPE.RUN_TIPIS,
          tabID: tabID,
          cacheID: tipisID,
        }
        await addRecentTab(tabsInfo)
      }
    },
    [addRecentTab, dispatch],
  )

  return addRunTipisTab
}

export const useUpdateCreateTipiTabToEditTipiTab = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()

  const changeCreateTipiToEditTipi = useCallback(
    async (tabID: string, tipisID: string) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      let currentTab = historyTabs.find(
        (tab) => tab.tabID === tabID && tab.tabType === TAB_TYPE.CREATE_TIPIS,
      )
      if (!currentTab) {
        currentTab = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.EDIT_TIPIS,
          tabID: v4(),
          cacheID: tipisID,
        }
        await addRecentTab(currentTab)
      } else {
        await updateRecentTab(tabID, {
          ...currentTab,
          tabType: TAB_TYPE.EDIT_TIPIS,
          cacheID: tipisID,
          tabID: v4(),
        })
      }

      navigate(getEditTipiPath(currentTeamInfo.identifier, tipisID))
    },
    [addRecentTab, navigate, updateRecentTab],
  )

  return changeCreateTipiToEditTipi
}

export const useAddTipisDetailTab = () => {
  const dispatch = useDispatch()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()

  const addTipisDetailTab = useCallback(
    async (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      const { tipisID, title, tabIcon } = tabInfo
      const exploreTipiTab = getExploreTipisTab(store.getState())

      const newTab = {
        tabName: title,
        tabIcon: tabIcon,
        tabType: TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        tabID: EXPLORE_TIPIS_ID,
        cacheID: tipisID,
      }
      if (exploreTipiTab) {
        await updateRecentTab(exploreTipiTab.tabID, newTab)
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
      } else {
        const recentTabs = getRecentTabInfos(store.getState())
        const currentTipiTab = recentTabs.find(
          (tab) =>
            tab.cacheID === tipisID &&
            tab.tabType === TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        )
        if (!currentTipiTab) {
          await addRecentTab(newTab)
        }
      }
    },
    [addRecentTab, dispatch, updateRecentTab],
  )

  return addTipisDetailTab
}

export const useAddMarketTipiDetailTab = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addMarketTipiDetailTab = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      const { tipisID, title, tabIcon } = tabInfo
      const exploreTipiTab = getExploreTipisTab(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const newTab = {
        tabName: title,
        tabIcon: tabIcon,
        tabType: TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL,
        tabID: EXPLORE_TIPIS_ID,
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

  return addMarketTipiDetailTab
}

// TODO
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
        `${getRunTipiPath(ownerTeamIdentifier, tipisID, tabID)}?myTeamIdentifier=${currentTeamInfo.identifier}`,
      )
    },
    [dispatch, navigate],
  )

  return runTipis
}

export const useAddChatTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()

  const addChatTab = useCallback(
    async (chatID: string) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const createTipisTab = historyTabs.find(
        (tab) => tab.tabType === TAB_TYPE.CHAT && tab.tabID === chatID,
      )

      if (createTipisTab) {
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(chatID))
      } else {
        const tabsInfo: ITabInfo = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.CHAT,
          tabID: chatID,
          cacheID: chatID,
        }
        await addRecentTab(tabsInfo)
      }
    },
    [addRecentTab, dispatch],
  )

  return addChatTab
}

export const useAddExploreTipisTab = () => {
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()

  const addExploreTipisTab = useCallback(async () => {
    const exploreTipiTab = getExploreTipisTab(store.getState())

    const newTab = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_TIPIS,
      tabID: EXPLORE_TIPIS_ID,
      cacheID: EXPLORE_TIPIS_ID,
    }
    if (exploreTipiTab) {
      updateRecentTab(exploreTipiTab.tabID, newTab)
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
    } else {
      const recentTabs = getRecentTabInfos(store.getState())
      const currentTipiTab = recentTabs.find(
        (tab) =>
          tab.cacheID === EXPLORE_TIPIS_ID &&
          tab.tabType === TAB_TYPE.EXPLORE_TIPIS,
      )
      if (!currentTipiTab) {
        await addRecentTab(newTab)
      }
    }
  }, [addRecentTab, dispatch, updateRecentTab])

  return addExploreTipisTab
}

export const useAddExploreFunctionsTab = () => {
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()

  const addExploreTipisTab = useCallback(async () => {
    const exploreFunctionTab = getExploreFunctionTab(store.getState())

    const newTab = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_FUNCTION,
      tabID: EXPLORE_FUNCTION_ID,
      cacheID: EXPLORE_FUNCTION_ID,
    }
    if (exploreFunctionTab) {
      updateRecentTab(exploreFunctionTab.tabID, newTab)
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
    } else {
      const recentTabs = getRecentTabInfos(store.getState())
      const currentTipiTab = recentTabs.find(
        (tab) =>
          tab.cacheID === EXPLORE_FUNCTION_ID &&
          tab.tabType === TAB_TYPE.EXPLORE_FUNCTION,
      )
      if (!currentTipiTab) {
        await addRecentTab(newTab)
      }
    }
  }, [addRecentTab, dispatch, updateRecentTab])

  return addExploreTipisTab
}

export const useCreateFunction = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()

  const createFunction = useCallback(async () => {
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CREATE_FUNCTION,
      tabID: tempID,
      cacheID: tempID,
    }
    await addRecentTab(tabsInfo)
    navigate(getCreateFunctionPath(currentTeamInfo?.identifier, tempID))
  }, [addRecentTab, navigate])

  return createFunction
}
