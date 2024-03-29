import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentId, getCurrentTeamInfo } from "@illa-public/user-data"
import store from "@/redux/store"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getExploreTipisTab,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import {
  addTabs,
  getTabs,
  removeTabs,
  updateTabs,
} from "../localForage/teamData"
import {
  getChatPath,
  getCreateFunctionPath,
  getCreateTipiPath,
  getEditTipiPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
  getTipiDetailPath,
} from "../routeHelper"
import { CREATE_TIPIS_ID, EXPLORE_TIPIS_ID } from "./constants"

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

export const useAddCreateTipisTab = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()

  const addCreateTipTab = useCallback(() => {
    const historyTabs = getRecentTabInfos(store.getState())
    const createTipisTab = historyTabs.find(
      (tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS,
    )
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    if (!createTipisTab) {
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.CREATE_TIPIS,
        tabID: CREATE_TIPIS_ID,
        cacheID: CREATE_TIPIS_ID,
      }
      addRecentTab(tabsInfo)
    } else {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(createTipisTab.tabID),
      )
    }
    navigate(getCreateTipiPath(currentTeamInfo?.identifier))
  }, [addRecentTab, dispatch, navigate])

  return addCreateTipTab
}

export const useAddEditTipisTab = () => {
  const addRecentTab = useAddRecentTabReducer()

  const addEditTipisTab = useCallback(
    (tipisID: string) => {
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
        addRecentTab(currentTab)
      }
    },
    [addRecentTab],
  )

  return addEditTipisTab
}

export const useCreateTipiToEditTipi = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const updateRecentTab = useUpdateRecentTabReducer()

  const changeCreateTipiToEditTipi = useCallback(
    (cacheID: string, tipisID: string) => {
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      let currentTab = historyTabs.find(
        (tab) =>
          tab.cacheID === cacheID && tab.tabType === TAB_TYPE.CREATE_TIPIS,
      )
      if (!currentTab) {
        currentTab = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.EDIT_TIPIS,
          tabID: v4(),
          cacheID: tipisID,
        }
        addRecentTab(currentTab)
      } else {
        updateRecentTab(cacheID, {
          ...currentTab,
          tabType: TAB_TYPE.EDIT_TIPIS,
          cacheID: tipisID,
        })
      }

      navigate(getEditTipiPath(currentTeamInfo.identifier, tipisID))
    },
    [addRecentTab, navigate, updateRecentTab],
  )

  return changeCreateTipiToEditTipi
}

export const useRunTipis = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()
  const dispatch = useDispatch()

  const runTipis = useCallback(
    async (tipisID: string) => {
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!
      const historyTabs = getRecentTabInfos(store.getState())
      const createTipisTab = historyTabs.find(
        (tab) => tab.tabType === TAB_TYPE.RUN_TIPIS && tab.cacheID === tipisID,
      )
      let tabID: string
      if (createTipisTab) {
        dispatch(
          recentTabActions.updateCurrentRecentTabIDReducer(
            createTipisTab.tabID,
          ),
        )
        tabID = createTipisTab.tabID
      } else {
        const newTabID = v4()

        const tabsInfo: ITabInfo = {
          tabName: "",
          tabIcon: "",
          tabType: TAB_TYPE.RUN_TIPIS,
          tabID: newTabID,
          cacheID: tipisID,
        }
        addRecentTab(tabsInfo)
        tabID = newTabID
      }
      navigate(
        `${getRunTipiPath(currentTeamInfo.identifier, tipisID)}/${tabID}`,
      )
    },
    [addRecentTab, dispatch, navigate],
  )

  return runTipis
}

export const useDetailTipis = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()

  const detailTipis = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      const { tipisID, title, tabIcon } = tabInfo
      const exploreTipiTab = getExploreTipisTab(store.getState())
      const currentTeamInfo = getCurrentTeamInfo(store.getState())!

      const newTab = {
        tabName: title,
        tabIcon: tabIcon,
        tabType: TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        tabID: EXPLORE_TIPIS_ID,
        cacheID: tipisID,
      }
      if (exploreTipiTab) {
        updateRecentTab(exploreTipiTab.tabID, newTab)
        dispatch(recentTabActions.updateCurrentRecentTabIDReducer(newTab.tabID))
      } else {
        const recentTabs = getRecentTabInfos(store.getState())
        const currentTipiTab = recentTabs.find(
          (tab) =>
            tab.cacheID === tipisID &&
            tab.tabType === TAB_TYPE.EXPLORE_TIPIS_DETAIL,
        )
        if (!currentTipiTab) {
          addRecentTab(newTab)
        }
      }
      navigate(getTipiDetailPath(currentTeamInfo.identifier, tipisID))
    },
    [addRecentTab, dispatch, navigate, updateRecentTab],
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

export const useAddCreateChatTab = () => {
  const addRecentTab = useAddRecentTabReducer()
  const navigate = useNavigate()
  const { chatID } = useParams()
  const dispatch = useDispatch()

  const createChat = useCallback(() => {
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    const historyTabs = getRecentTabInfos(store.getState())
    const createTipisTab = historyTabs.find(
      (tab) => tab.tabType === TAB_TYPE.CHAT && tab.cacheID === chatID,
    )

    if (createTipisTab) {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(createTipisTab.tabID),
      )
    } else {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.CHAT,
        tabID: tempID,
        cacheID: tempID,
      }
      addRecentTab(tabsInfo)
    }

    navigate(getChatPath(currentTeamInfo?.identifier, chatID))
  }, [addRecentTab, chatID, dispatch, navigate])

  return createChat
}

export const useGoToExploreTipis = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()

  const goToExploreTipis = useCallback(() => {
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    const tipisTab = historyTabs.find((item) => item.tabID === EXPLORE_TIPIS_ID)
    if (tipisTab) {
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tipisTab.tabID))
    } else {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.EXPLORE_TIPIS,
        tabID: EXPLORE_TIPIS_ID,
        cacheID: tempID,
      }
      addRecentTab(tabsInfo)
    }
    navigate(getExploreTipisPath(currentTeamInfo?.identifier))
  }, [addRecentTab, dispatch, navigate])

  return goToExploreTipis
}

export const useGoToExploreFunctions = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const addRecentTab = useAddRecentTabReducer()

  const goToExploreFunctions = useCallback(() => {
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    const functionTab = historyTabs.find(
      (item) => item.tabType === TAB_TYPE.EXPLORE_FUNCTION,
    )
    if (functionTab) {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(functionTab.tabID),
      )
    } else {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.EXPLORE_FUNCTION,
        tabID: tempID,
        cacheID: tempID,
      }
      addRecentTab(tabsInfo)
    }
    navigate(getExploreFunctionsPath(currentTeamInfo?.identifier))
  }, [addRecentTab, dispatch, navigate])

  return goToExploreFunctions
}

export const useCreateFunction = () => {
  const navigate = useNavigate()
  const addRecentTab = useAddRecentTabReducer()

  const createFunction = useCallback(() => {
    const currentTeamInfo = getCurrentTeamInfo(store.getState())!
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CREATE_FUNCTION,
      tabID: tempID,
      cacheID: tempID,
    }
    addRecentTab(tabsInfo)
    navigate(getCreateFunctionPath(currentTeamInfo?.identifier, tempID))
  }, [addRecentTab, navigate])

  return createFunction
}
