import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { TeamInfo } from "@illa-public/public-types"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import {
  getLocalTeamIdentifier,
  removeLocalTeamIdentifier,
  setLocalTeamIdentifier,
} from "../storage/cacheTeam"

export const findRecentTeamInfo = (teamInfos: TeamInfo[]) => {
  const cacheTeamIdentifier = getLocalTeamIdentifier()
  if (cacheTeamIdentifier) {
    const targetTeam = teamInfos.find(
      (team) => team.identifier === cacheTeamIdentifier,
    )
    if (targetTeam) {
      setLocalTeamIdentifier(targetTeam.identifier)
      return targetTeam
    }
  }
  if (teamInfos.length === 0) {
    removeLocalTeamIdentifier()
    return undefined
  }
  setLocalTeamIdentifier(teamInfos[0].identifier)
  return teamInfos[0]
}

export const useGetCurrentTeamInfo = () => {
  const [searchParams] = useSearchParams()
  const { teamIdentifier } = useParams()
  const myTeamIdentifier = searchParams.get("myTeamIdentifier")

  const { data } = useGetTeamsInfoQuery(null)

  const currentTeamInfo = useMemo(() => {
    if (data) {
      const cacheTeamIdentifier = getLocalTeamIdentifier() as string | undefined

      const priorityOrder = [
        myTeamIdentifier,
        teamIdentifier,
        cacheTeamIdentifier,
      ]

      for (let teamIdentifier of priorityOrder) {
        const currentTeamInfo = data.find(
          (team) => team.identifier === teamIdentifier,
        )
        if (currentTeamInfo) {
          return currentTeamInfo
        }
      }
    }
    return undefined
  }, [data, myTeamIdentifier, teamIdentifier])

  return currentTeamInfo
}
