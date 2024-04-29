import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import store from "@/redux/store"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getExploreFunctionTab,
  getExploreTipisTab,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import {
  getEditFunctionPath,
  getEditTipiPath,
  getExploreTipisPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
} from "../routeHelper"
import {
  useAddRecentTabReducer,
  useBatchUpdateRecentTabReducer,
  useRemoveRecentTabReducer,
  useUpdateRecentTabReducer,
} from "./baseHook"
import {
  CREATE_FUNCTION_ID,
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

export const useAddOrUpdateEditTipisTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()
  const batchUpdateRecentTab = useBatchUpdateRecentTabReducer()

  const addEditTipisTab = useCallback(
    async (tipisInfo: { tipisName: string; tipisID: string }) => {
      const { tipisID, tipisName } = tipisInfo
      const historyTabs = getRecentTabInfos(store.getState())
      const useThisTipTab = historyTabs.filter((tab) => tab.cacheID === tipisID)
      const newTabInfo = {
        tabName: tipisName,
        tabIcon: "",
        tabType: TAB_TYPE.EDIT_TIPIS,
        tabID: v4(),
        cacheID: tipisID,
      }
      if (useThisTipTab.length > 0) {
        const currentTab = useThisTipTab.find(
          (tab) => tab.tabType === TAB_TYPE.EDIT_TIPIS,
        )

        const needUpdateTabInfoTab = useThisTipTab.filter(
          (tab) =>
            tab.tabType === TAB_TYPE.RUN_TIPIS ||
            tab.tabType === TAB_TYPE.EDIT_TIPIS,
        )
        if (needUpdateTabInfoTab.length > 0) {
          const updateSlice = needUpdateTabInfoTab
            .map((tabInfo) => ({
              ...tabInfo,
              cacheID: tipisID,
              tabName: tipisName,
            }))
            .reduce(
              (acc, tabInfo) => {
                acc[tabInfo.tabID] = tabInfo
                return acc
              },
              {} as Record<string, ITabInfo>,
            )

          await batchUpdateRecentTab(updateSlice)
        }

        if (currentTab) {
          dispatch(
            recentTabActions.updateCurrentRecentTabIDReducer(currentTab.tabID),
          )
        } else {
          await addRecentTab(newTabInfo)
        }
      } else {
        await addRecentTab(newTabInfo)
      }
    },
    [addRecentTab, batchUpdateRecentTab, dispatch],
  )

  return addEditTipisTab
}

export const useAddOrUpdateRunTipisTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()
  const batchUpdateRecentTab = useBatchUpdateRecentTabReducer()

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
      const useThisTipTab = historyTabs.filter((tab) => tab.cacheID === tipisID)

      const tabsInfo: ITabInfo = {
        tabName: tipisName,
        tabIcon: tipisIcon,
        tabType: TAB_TYPE.RUN_TIPIS,
        tabID: tabID,
        cacheID: tipisID,
      }

      if (useThisTipTab.length > 0) {
        const thisTab = useThisTipTab.find(
          (tab) => tab.tabID === tabID && tab.tabType === TAB_TYPE.RUN_TIPIS,
        )
        const needUpdateTabInfoTab = useThisTipTab.filter(
          (tab) =>
            tab.tabType === TAB_TYPE.RUN_TIPIS ||
            tab.tabType === TAB_TYPE.EDIT_TIPIS,
        )
        if (needUpdateTabInfoTab.length > 0) {
          const updateSlice = needUpdateTabInfoTab
            .map((tabInfo) => ({
              ...tabInfo,
              cacheID: tipisID,
              tabName: tipisName,
              tabIcon: tipisIcon,
            }))
            .reduce(
              (acc, tabInfo) => {
                acc[tabInfo.tabID] = tabInfo
                return acc
              },
              {} as Record<string, ITabInfo>,
            )

          await batchUpdateRecentTab(updateSlice)
        }

        if (thisTab) {
          dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tabID))
        } else {
          await addRecentTab(tabsInfo)
        }
      } else {
        await addRecentTab(tabsInfo)
      }
    },
    [addRecentTab, batchUpdateRecentTab, dispatch],
  )

  return addRunTipisTab
}

export const useUpdateCreateTipiTabToEditTipiTab = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()

  const changeCreateTipiToEditTipi = useCallback(
    async (
      tabID: string,
      tabInfo: {
        tabName: string
        tabIcon: string
        cacheID: string
      },
    ) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      let currentTab = historyTabs.find(
        (tab) => tab.tabID === tabID && tab.tabType === TAB_TYPE.CREATE_TIPIS,
      )
      if (!currentTab) {
        currentTab = {
          ...tabInfo,
          tabType: TAB_TYPE.EDIT_TIPIS,
          tabID: v4(),
        }
        await addRecentTab(currentTab)
      } else {
        await updateRecentTab(tabID, {
          ...currentTab,
          ...tabInfo,
          tabType: TAB_TYPE.EDIT_TIPIS,
          tabID: v4(),
        })
      }

      navigate(getEditTipiPath(currentTeamInfo.identifier, tabInfo.cacheID))
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
        `${getRunTipiPath(currentTeamInfo.identifier, tipisID, tabID)}?&ownerTeamIdentifier=${ownerTeamIdentifier}=${ownerTeamIdentifier}`,
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
      await updateRecentTab(exploreTipiTab.tabID, newTab)
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
      await updateRecentTab(exploreFunctionTab.tabID, newTab)
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

export const useAddCreateFunction = () => {
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()

  const addCreateFunctionTab = useCallback(
    async (functionType: string) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const createFunctionTab = historyTabs.find(
        (tab) =>
          tab.tabType === TAB_TYPE.CREATE_FUNCTION &&
          tab.cacheID === functionType,
      )
      if (!createFunctionTab) {
        const tabsInfo: ITabInfo = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.CREATE_FUNCTION,
          tabID: CREATE_FUNCTION_ID,
          cacheID: functionType,
        }
        await addRecentTab(tabsInfo)
      } else {
        dispatch(
          recentTabActions.updateCurrentRecentTabIDReducer(
            createFunctionTab.tabID,
          ),
        )
      }
    },
    [addRecentTab, dispatch],
  )

  return addCreateFunctionTab
}

export const useAddOrUpdateEditFunctionTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()
  const batchUpdateRecentTab = useBatchUpdateRecentTabReducer()

  const addOrUpdateEditFunctionTab = useCallback(
    async (functionInfo: { functionName: string; functionID: string }) => {
      const { functionID, functionName } = functionInfo
      const historyTabs = getRecentTabInfos(store.getState())
      const useThisTipTab = historyTabs.filter(
        (tab) => tab.cacheID === functionID,
      )
      const newTabInfo = {
        tabName: functionName,
        tabIcon: "",
        tabType: TAB_TYPE.EDIT_FUNCTION,
        tabID: v4(),
        cacheID: functionID,
      }
      if (useThisTipTab.length > 0) {
        const currentTab = useThisTipTab.find(
          (tab) => tab.tabType === TAB_TYPE.EDIT_FUNCTION,
        )

        const needUpdateTabInfoTab = useThisTipTab.filter(
          (tab) => tab.tabType === TAB_TYPE.EDIT_FUNCTION,
        )
        if (needUpdateTabInfoTab.length > 0) {
          const updateSlice = needUpdateTabInfoTab
            .map((tabInfo) => ({
              ...tabInfo,
              cacheID: functionID,
              tabName: functionName,
            }))
            .reduce(
              (acc, tabInfo) => {
                acc[tabInfo.tabID] = tabInfo
                return acc
              },
              {} as Record<string, ITabInfo>,
            )

          await batchUpdateRecentTab(updateSlice)
        }

        if (currentTab) {
          dispatch(
            recentTabActions.updateCurrentRecentTabIDReducer(currentTab.tabID),
          )
        } else {
          await addRecentTab(newTabInfo)
        }
      } else {
        await addRecentTab(newTabInfo)
      }
    },
    [addRecentTab, batchUpdateRecentTab, dispatch],
  )

  return addOrUpdateEditFunctionTab
}

export const useUpdateCreateToEditFunctionTab = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()
  const deleteTab = useRemoveRecentTabReducer()

  const changeCreateToEditFunction = useCallback(
    async (
      tabID: string,
      tabInfo: {
        tabName: string
        tabIcon: string
        cacheID: string
      },
    ) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!
      await deleteTab(tabID)
      let currentTab = historyTabs.find(
        (tab) =>
          tab.tabID === tabID && tab.tabType === TAB_TYPE.CREATE_FUNCTION,
      )
      if (!currentTab) {
        currentTab = {
          ...tabInfo,
          tabType: TAB_TYPE.EDIT_FUNCTION,
          tabID: v4(),
        }
        await addRecentTab(currentTab)
      } else {
        await updateRecentTab(tabID, {
          ...currentTab,
          ...tabInfo,
          tabType: TAB_TYPE.EDIT_FUNCTION,
          tabID: v4(),
        })
      }

      navigate(getEditFunctionPath(currentTeamInfo.identifier, tabInfo.cacheID))
    },
    [addRecentTab, deleteTab, navigate, updateRecentTab],
  )

  return changeCreateToEditFunction
}

export const useUpdateCurrentTabToTipisDashboard = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()
  const currentTabID = useSelector(getCurrentTabID)
  const deleteTab = useRemoveRecentTabReducer()

  const updateCurrentTabToTipisDashboard = useCallback(
    async (tabInfo: { tabName: string; tabIcon: string; cacheID: string }) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!
      await deleteTab(currentTabID)

      let exploreTipisTab = historyTabs.find(
        (tab) => tab.tabID === EXPLORE_TIPIS_ID,
      )

      if (!exploreTipisTab) {
        exploreTipisTab = {
          ...tabInfo,
          tabType: TAB_TYPE.EXPLORE_TIPIS,
          tabID: EXPLORE_TIPIS_ID,
        }
        await addRecentTab(exploreTipisTab)
      } else {
        await updateRecentTab(EXPLORE_TIPIS_ID, {
          ...exploreTipisTab,
          ...tabInfo,
          tabType: TAB_TYPE.EXPLORE_TIPIS,
          tabID: EXPLORE_TIPIS_ID,
        })
      }

      navigate(getExploreTipisPath(currentTeamInfo.identifier))
    },
    [addRecentTab, currentTabID, deleteTab, navigate, updateRecentTab],
  )

  return updateCurrentTabToTipisDashboard
}
