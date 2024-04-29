import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useLazyGetTeamsInfoQuery } from "@illa-public/user-data"
import {
  EMPTY_TEAM_PATH,
  getChatPath,
  getCreateFunctionPath,
  getCreateTipiPath,
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
  useAddOrUpdateEditTipisTab,
  useAddOrUpdateRunTipisTab,
  useAddTipisDetailTab,
} from "../recentTabs/hook"
import { removeLocalTeamIdentifier } from "../storage/cacheTeam"
import { findRecentTeamInfo, useGetCurrentTeamInfo } from "../team"

export const NOT_HAS_TEAM_INFO_KEY = "NOT_HAS_TEAM_INFO"
export const NOT_HAS_TARGET_TEAM_INFO_KEY = "NOT_HAS_TARGET_TEAM_INFO"

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
        return recentTeamInfo.identifier
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
    if (currentTeamInfo?.identifier) {
      navigate(getCreateTipiPath(currentTeamInfo?.identifier))
    }
  }, [addCreateTipisTab, currentTeamInfo?.identifier, navigate])
  return navigateToCreteTipis
}

export const useNavigateToEditTipis = () => {
  const navigate = useNavigate()
  const addEditTipisTab = useAddOrUpdateEditTipisTab()
  const currentTeamInfo = useGetCurrentTeamInfo()

  const navigateToEditTipis = useCallback(
    async (tipisInfo: { tipisName: string; tipisID: string }) => {
      await addEditTipisTab(tipisInfo)
      if (currentTeamInfo?.identifier) {
        navigate(getEditTipiPath(currentTeamInfo.identifier, tipisInfo.tipisID))
      }
    },
    [addEditTipisTab, currentTeamInfo?.identifier, navigate],
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
      if (currentTeamInfo?.identifier) {
        if (
          tipiOwnerTeamIdentity &&
          tipiOwnerTeamIdentity !== currentTeamInfo.identifier
        ) {
          navigate(
            `${getRunTipiPath(currentTeamInfo.identifier, tabInfo.tipisID, tabID)}?ownerTeamIdentifier=${tipiOwnerTeamIdentity}`,
          )
        } else {
          navigate(
            `${getRunTipiPath(currentTeamInfo.identifier, tabInfo.tipisID, tabID)}`,
          )
        }
      }
    },
    [addRunTipisTab, currentTeamInfo?.identifier, navigate],
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
      if (currentTeamInfo?.identifier) {
        navigate(getTipiDetailPath(currentTeamInfo.identifier, tabInfo.tipisID))
      }
    },
    [addTipisDetailTab, currentTeamInfo?.identifier, navigate],
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
      if (currentTeamInfo?.identifier) {
        navigate(
          getMarketTipiDetailPath(currentTeamInfo.identifier, tabInfo.tipisID),
        )
      }
    },
    [addMarketTipisDetailTab, navigate, currentTeamInfo?.identifier],
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
      if (currentTeamInfo?.identifier) {
        navigate(getChatPath(currentTeamInfo.identifier, chatID))
      }
    },
    [addChatTab, currentTeamInfo?.identifier, navigate],
  )
  return navigateToChat
}

export const useNavigateToExploreTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addExploreTipisTab = useAddExploreTipisTab()

  const navigateToExploreTipis = useCallback(async () => {
    await addExploreTipisTab()
    if (currentTeamInfo?.identifier) {
      navigate(getExploreTipisPath(currentTeamInfo.identifier))
    }
  }, [addExploreTipisTab, currentTeamInfo?.identifier, navigate])
  return navigateToExploreTipis
}

export const useNavigateToExploreFunction = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addExploreFunctionTab = useAddExploreFunctionsTab()

  const navigateToExploreTipis = useCallback(async () => {
    await addExploreFunctionTab()
    if (currentTeamInfo?.identifier) {
      navigate(getExploreFunctionsPath(currentTeamInfo.identifier))
    }
  }, [addExploreFunctionTab, currentTeamInfo?.identifier, navigate])
  return navigateToExploreTipis
}

export const useNavigateToCreateFunction = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const addCreateFunctionTab = useAddCreateFunction()

  const navigateToCreteTipis = useCallback(
    async (functionType: string) => {
      await addCreateFunctionTab(functionType)
      if (currentTeamInfo?.identifier) {
        navigate(
          getCreateFunctionPath(currentTeamInfo?.identifier, functionType),
        )
      }
    },
    [addCreateFunctionTab, currentTeamInfo?.identifier, navigate],
  )
  return navigateToCreteTipis
}
