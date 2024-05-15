import { isEqual } from "lodash-es"
import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useGetTeamsInfoAndCurrentIDQuery } from "@illa-public/user-data"
import { EMPTY_TEAM_PATH } from "@/router/constants"
import { BaseProtectComponentProps } from "@/router/interface"
import {
  getSessionCurrentTeamInfo,
  setSessionCurrentTeamInfo,
} from "@/utils/storage/cacheTeam"

const TeamCheck: FC<BaseProtectComponentProps> = (props) => {
  const { teamIdentifier } = useParams()
  const { data, isSuccess, error } = useGetTeamsInfoAndCurrentIDQuery(
    teamIdentifier,
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
      // TODO: group, need after billing
      // TipisTrack.group(currentTeam.id, {
      //   name: currentTeam.name,
      //   identifier: currentTeam.identify,
      //   paymentPlan: currentTeam.credit.plan,
      //   cycle: currentTeam.credit.cycle,
      // })
    }

    // TODO: team user role check
    // if (
    //   Array.isArray(props.needRole) &&
    //   props.needRole.length > 0 &&
    //   !props.needRole.includes(currentTeam.myRole)
    // ) {
    //   return <Navigate to="/403" />
    // }
  }

  return isSuccess ? <>{props.children}</> : null
}

export default TeamCheck
