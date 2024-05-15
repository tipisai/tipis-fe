import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { ITeamInfoVO } from "@illa-public/public-types"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import {
  getLocalTeamIdentifier,
  removeLocalTeamIdentifier,
  setLocalTeamIdentifier,
} from "../storage/cacheTeam"

export const findRecentTeamInfo = (teamInfos: ITeamInfoVO[]) => {
  const cacheTeamIdentifier = getLocalTeamIdentifier()
  if (cacheTeamIdentifier) {
    const targetTeam = teamInfos.find(
      (team) => team.identify === cacheTeamIdentifier,
    )
    if (targetTeam) {
      setLocalTeamIdentifier(targetTeam.identify)
      return targetTeam
    }
  }
  if (teamInfos.length === 0) {
    removeLocalTeamIdentifier()
    return undefined
  }
  setLocalTeamIdentifier(teamInfos[0].identify)
  return teamInfos[0]
}

export const useGetCurrentTeamInfo = () => {
  const { teamIdentifier } = useParams()

  const { data } = useGetTeamsInfoQuery(null)

  const currentTeamInfo = useMemo(() => {
    if (data) {
      const cacheTeamIdentifier = getLocalTeamIdentifier() as string | undefined

      const priorityOrder = [teamIdentifier, cacheTeamIdentifier]

      for (let teamIdentifier of priorityOrder) {
        const currentTeamInfo = data.find(
          (team) => team.identify === teamIdentifier,
        )
        if (currentTeamInfo) {
          return currentTeamInfo
        }
      }
    }
    return undefined
  }, [data, teamIdentifier])

  return currentTeamInfo
}
