import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useLazyGetTeamsInfoQuery } from "@illa-public/user-data"
import { EMPTY_TEAM_PATH } from "@/router/constants"
import {
  CREATE_FUNCTION_FROM_SINGLE,
  CREATE_FUNCTION_FROM_SINGLE_KEY,
  CREATE_FUNCTION_FROM_TAB_KEY,
  getChatPath,
  getCreateFunctionPath,
  getCreateTipiPath,
  getEditFunctionPath,
  getEditTipiPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
  getTipiDetailPath,
} from "."
import {
  useAddChatTab,
  useAddCreateFunction,
  useAddCreateTipisTab,
  useAddExploreFunctionsTab,
  useAddExploreTipisTab,
  useAddMarketTipiDetailTab,
  useAddOrUpdateEditFunctionTab,
  useAddOrUpdateEditTipisTab,
  useAddOrUpdateRunTipisTab,
  useAddTipisDetailTab,
} from "../recentTabs/hook"
import { removeLocalTeamIdentifier } from "../storage/cacheTeam"
import { findRecentTeamInfo, useGetCurrentTeamInfo } from "../team"

export const NOT_HAS_TEAM_INFO_KEY = "NOT_HAS_TEAM_INFO"
export const NOT_HAS_TARGET_TEAM_INFO_KEY = "NOT_HAS_TARGET_TEAM_INFO"

export const useNavigateByTabID = () => {
  const navigateByTabID = useCallback(async () => {}, [])

  return navigateByTabID
}

export const useNavigateTargetWorkspace = () => {
  const navigate = useNavigate()
  const [getTeamsInfo] = useLazyGetTeamsInfoQuery()

  const getTargetTeamIdentifier = useCallback(async () => {
    try {
      const teamInfos = await getTeamsInfo(null).unwrap()
      if (!Array.isArray(teamInfos) || teamInfos.length === 0) {
        throw new Error(NOT_HAS_TEAM_INFO_KEY)
      }
      const recentTeamInfo = findRecentTeamInfo(teamInfos)
      if (recentTeamInfo) {
        return recentTeamInfo.identify
      }
      throw new Error(NOT_HAS_TARGET_TEAM_INFO_KEY)
    } catch (e) {
      removeLocalTeamIdentifier()
      throw e
    }
  }, [getTeamsInfo])

  const navigateTargetWorkspace = useCallback(async () => {
    try {
      const teamIdentifier = await getTargetTeamIdentifier()
      if (teamIdentifier) {
        navigate(`/workspace/${teamIdentifier}`)
      } else {
        navigate("/403")
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === NOT_HAS_TARGET_TEAM_INFO_KEY) {
          navigate("/403")
        } else if (e.message === NOT_HAS_TEAM_INFO_KEY) {
          navigate(EMPTY_TEAM_PATH)
        } else {
          navigate("/404")
        }
      } else {
        navigate("/403")
      }
    }
  }, [getTargetTeamIdentifier, navigate])

  return navigateTargetWorkspace
}

export const useNavigateToCreateTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addCreateTipisTab = useAddCreateTipisTab()

  const navigateToCreteTipis = useCallback(async () => {
    await addCreateTipisTab()
    if (currentTeamInfo?.identify) {
      navigate(getCreateTipiPath(currentTeamInfo?.identify))
    }
  }, [addCreateTipisTab, currentTeamInfo?.identify, navigate])
  return navigateToCreteTipis
}

export const useNavigateToEditTipis = () => {
  const navigate = useNavigate()
  const addEditTipisTab = useAddOrUpdateEditTipisTab()
  const currentTeamInfo = useGetCurrentTeamInfo()

  const navigateToEditTipis = useCallback(
    async (tipisInfo: { tipisName: string; tipisID: string }) => {
      await addEditTipisTab(tipisInfo)
      if (currentTeamInfo?.identify) {
        navigate(getEditTipiPath(currentTeamInfo.identify, tipisInfo.tipisID))
      }
    },
    [addEditTipisTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToEditTipis
}

export const useNavigateToRunTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addRunTipisTab = useAddOrUpdateRunTipisTab()

  const navigateToRunTipis = useCallback(
    async (
      tabInfo: {
        tipisID: string
        tipisIcon: string
        tipisName: string
      },
      tabID: string,
      tipiOwnerTeamIdentity?: string,
    ) => {
      await addRunTipisTab(tabInfo, tabID)
      if (currentTeamInfo?.identify) {
        if (
          tipiOwnerTeamIdentity &&
          tipiOwnerTeamIdentity !== currentTeamInfo.identify
        ) {
          navigate(
            `${getRunTipiPath(currentTeamInfo.identify, tabInfo.tipisID, tabID)}?ownerTeamIdentifier=${tipiOwnerTeamIdentity}`,
          )
        } else {
          navigate(
            `${getRunTipiPath(currentTeamInfo.identify, tabInfo.tipisID, tabID)}`,
          )
        }
      }
    },
    [addRunTipisTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToRunTipis
}

export const useNavigateToTipiDetail = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addTipisDetailTab = useAddTipisDetailTab()

  const navigateToTipiDetail = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      addTipisDetailTab(tabInfo)
      if (currentTeamInfo?.identify) {
        navigate(getTipiDetailPath(currentTeamInfo.identify, tabInfo.tipisID))
      }
    },
    [addTipisDetailTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToTipiDetail
}

export const useNavigateToMarketTipiDetail = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addMarketTipisDetailTab = useAddMarketTipiDetailTab()

  const navigateToMarketTipiDetail = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      addMarketTipisDetailTab(tabInfo)
      if (currentTeamInfo?.identify) {
        navigate(
          getMarketTipiDetailPath(currentTeamInfo.identify, tabInfo.tipisID),
        )
      }
    },
    [addMarketTipisDetailTab, navigate, currentTeamInfo?.identify],
  )
  return navigateToMarketTipiDetail
}

export const useNavigateToNewChat = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addChatTab = useAddChatTab()

  const navigateToChat = useCallback(
    async (chatID: string) => {
      await addChatTab(chatID)
      if (currentTeamInfo?.identify) {
        navigate(getChatPath(currentTeamInfo.identify, chatID))
      }
    },
    [addChatTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToChat
}

export const useNavigateToExploreTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addExploreTipisTab = useAddExploreTipisTab()

  const navigateToExploreTipis = useCallback(async () => {
    await addExploreTipisTab()
    if (currentTeamInfo?.identify) {
      navigate(getExploreTipisPath(currentTeamInfo.identify))
    }
  }, [addExploreTipisTab, currentTeamInfo?.identify, navigate])
  return navigateToExploreTipis
}

export const useNavigateToExploreFunction = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addExploreFunctionTab = useAddExploreFunctionsTab()

  const navigateToExploreTipis = useCallback(async () => {
    await addExploreFunctionTab()
    if (currentTeamInfo?.identify) {
      navigate(getExploreFunctionsPath(currentTeamInfo.identify))
    }
  }, [addExploreFunctionTab, currentTeamInfo?.identify, navigate])
  return navigateToExploreTipis
}

export const useNavigateToCreateFunction = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addCreateFunctionTab = useAddCreateFunction()

  const navigateToCreteTipis = useCallback(
    async (
      functionType: string,
      from?: CREATE_FUNCTION_FROM_SINGLE,
      tabID?: string,
    ) => {
      await addCreateFunctionTab(functionType)
      if (currentTeamInfo?.identify) {
        const searchParams = new URLSearchParams()
        if (from) {
          searchParams.append(CREATE_FUNCTION_FROM_SINGLE_KEY, from)
        }
        if (tabID) {
          searchParams.append(CREATE_FUNCTION_FROM_TAB_KEY, tabID)
        }
        if (!!searchParams.toString()) {
          navigate(
            `${getCreateFunctionPath(currentTeamInfo?.identify, functionType)}?${searchParams.toString()}`,
          )
        } else {
          navigate(
            getCreateFunctionPath(currentTeamInfo?.identify, functionType),
          )
        }
      }
    },
    [addCreateFunctionTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToCreteTipis
}

export const useNavigateToEditFunction = () => {
  const navigate = useNavigate()
  const addOrUpdateEditFunctionTab = useAddOrUpdateEditFunctionTab()
  const currentTeamInfo = useGetCurrentTeamInfo()

  const navigateToEditTipis = useCallback(
    async (functionInfo: { functionName: string; functionID: string }) => {
      await addOrUpdateEditFunctionTab(functionInfo)
      if (currentTeamInfo?.identify) {
        navigate(
          getEditFunctionPath(
            currentTeamInfo.identify,
            functionInfo.functionID,
          ),
        )
      }
    },
    [addOrUpdateEditFunctionTab, currentTeamInfo?.identify, navigate],
  )
  return navigateToEditTipis
}
