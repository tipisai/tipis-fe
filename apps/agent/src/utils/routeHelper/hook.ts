import { useCallback } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  getCurrentTeamInfo,
  useLazyGetTeamsInfoQuery,
} from "@illa-public/user-data"
import {
  getChatPath,
  getCreateTipiPath,
  getEditTipiPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
  getRunTipiPath,
  getTipiDetailPath,
} from "."
import { removeLocalTeamIdentifier } from "../auth"
import {
  useAddChatTab,
  useAddCreateTipisTab,
  useAddEditTipisTab,
  useAddExploreFunctionsTab,
  useAddExploreTipisTab,
  useAddMarketTipiDetailTab,
  useAddRunTipisTab,
  useAddTipisDetailTab,
} from "../recentTabs/hook"
import { findRecentTeamInfo } from "../team"

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
        if (e.message === NOT_HAS_TEAM_INFO_KEY) {
          navigate("/403")
        } else if (e.message === NOT_HAS_TARGET_TEAM_INFO_KEY) {
          navigate("/workspace")
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
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addCreateTipisTab = useAddCreateTipisTab()

  const navigateToCreteTipis = useCallback(() => {
    addCreateTipisTab()
    navigate(getCreateTipiPath(currentTeamInfo?.identifier))
  }, [addCreateTipisTab, currentTeamInfo?.identifier, navigate])
  return navigateToCreteTipis
}

export const useNavigateToEditTipis = () => {
  const navigate = useNavigate()
  const addEditTipisTab = useAddEditTipisTab()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const navigateToEditTipis = useCallback(
    (tipisID: string) => {
      addEditTipisTab(tipisID)
      navigate(getEditTipiPath(currentTeamInfo?.identifier, tipisID))
    },
    [addEditTipisTab, currentTeamInfo?.identifier, navigate],
  )
  return navigateToEditTipis
}

export const useNavigateToRunTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addRunTipisTab = useAddRunTipisTab()

  const navigateToRunTipis = useCallback(
    (
      tabInfo: {
        tipisID: string
        tipisIcon: string
        tipisName: string
      },
      tabID: string,
    ) => {
      addRunTipisTab(tabInfo, tabID)
      navigate(
        `${getRunTipiPath(currentTeamInfo.identifier, tabInfo.tipisID)}/${tabID}`,
      )
    },
    [addRunTipisTab, currentTeamInfo.identifier, navigate],
  )
  return navigateToRunTipis
}

export const useNavigateToTipiDetail = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addTipisDetailTab = useAddTipisDetailTab()

  const navigateToTipiDetail = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      addTipisDetailTab(tabInfo)
      navigate(getTipiDetailPath(currentTeamInfo.identifier, tabInfo.tipisID))
    },
    [addTipisDetailTab, currentTeamInfo.identifier, navigate],
  )
  return navigateToTipiDetail
}

export const useNavigateToMarketTipiDetail = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addMarketTipisDetailTab = useAddMarketTipiDetailTab()

  const navigateToMarketTipiDetail = useCallback(
    (tabInfo: { tipisID: string; title: string; tabIcon: string }) => {
      addMarketTipisDetailTab(tabInfo)
      navigate(getTipiDetailPath(currentTeamInfo.identifier, tabInfo.tipisID))
    },
    [addMarketTipisDetailTab, navigate, currentTeamInfo.identifier],
  )
  return navigateToMarketTipiDetail
}

export const useNavigateToNewChat = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addChatTab = useAddChatTab()

  const navigateToChat = useCallback(
    (chatID: string) => {
      addChatTab(chatID)
      navigate(getChatPath(currentTeamInfo.identifier, chatID))
    },
    [addChatTab, currentTeamInfo.identifier, navigate],
  )
  return navigateToChat
}

export const useNavigateToExploreTipis = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addExploreTipisTab = useAddExploreTipisTab()

  const navigateToExploreTipis = useCallback(() => {
    addExploreTipisTab()
    navigate(getExploreTipisPath(currentTeamInfo?.identifier))
  }, [addExploreTipisTab, currentTeamInfo?.identifier, navigate])
  return navigateToExploreTipis
}

export const useNavigateToExploreFunction = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const addExploreFunctionTab = useAddExploreFunctionsTab()

  const navigateToExploreTipis = useCallback(() => {
    addExploreFunctionTab()
    navigate(getExploreFunctionsPath(currentTeamInfo?.identifier))
  }, [addExploreFunctionTab, currentTeamInfo?.identifier, navigate])
  return navigateToExploreTipis
}
