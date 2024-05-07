import { isEqual } from "lodash-es"
import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetTeamsInfoAndCurrentIDQuery } from "@illa-public/user-data"
import { BaseProtectComponentProps } from "@/router/interface"
import { EMPTY_TEAM_PATH } from "@/utils/routeHelper"
import {
  getSessionCurrentTeamInfo,
  setSessionCurrentTeamInfo,
} from "@/utils/storage/cacheTeam"

const TeamCheck: FC<BaseProtectComponentProps> = (props) => {
  const { teamIdentifier } = useParams()
  const mixedTeamIdentifier = teamIdentifier
  const { data, isSuccess, error } = useGetTeamsInfoAndCurrentIDQuery(
    mixedTeamIdentifier,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  )
  const cacheCurrentTeamInfo = getSessionCurrentTeamInfo()

  if (error && "status" in error) {
    return <Navigate to="/404" />
  }

  if (data) {
    if (!Array.isArray(data.teams) || data.teams.length === 0) {
      return <Navigate to={EMPTY_TEAM_PATH} />
    }

    if (!data.currentTeamID || !teamIdentifier) {
      return <Navigate to="/404" />
    }

    const currentTeam = data.currentTeamInfo!

    if (!isEqual(cacheCurrentTeamInfo, currentTeam)) {
      setSessionCurrentTeamInfo(currentTeam)
      TipisTrack.group(currentTeam.id, {
        name: currentTeam.name,
        identifier: currentTeam.identifier,
        paymentPlan: currentTeam.credit.plan,
        cycle: currentTeam.credit.cycle,
      })
    }

    if (
      Array.isArray(props.needRole) &&
      props.needRole.length > 0 &&
      !props.needRole.includes(currentTeam.myRole)
    ) {
      return <Navigate to="/403" />
    }
  }

  return isSuccess ? <>{props.children}</> : null
}

export default TeamCheck
