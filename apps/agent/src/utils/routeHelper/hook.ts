import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useLazyGetTeamsInfoQuery } from "@illa-public/user-data"
import { removeLocalTeamIdentifier } from "../auth"
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
