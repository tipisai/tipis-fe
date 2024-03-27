import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { TeamInfo } from "@illa-public/public-types"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import {
  getLocalTeamIdentifier,
  removeLocalTeamIdentifier,
  setLocalTeamIdentifier,
} from "../auth"

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
  const cacheTeamIdentifier = getLocalTeamIdentifier() as string | undefined
  const mixedTeamIdentifier =
    myTeamIdentifier || teamIdentifier || cacheTeamIdentifier

  const { data } = useGetTeamsInfoQuery(null)

  const currentTeamInfo = useMemo(() => {
    if (data) {
      return data.find((team) => team.identifier === mixedTeamIdentifier)
    }
    return undefined
  }, [data, mixedTeamIdentifier])

  return currentTeamInfo
}
