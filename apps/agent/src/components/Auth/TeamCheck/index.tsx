import { FC } from "react"
import { Navigate, useParams, useSearchParams } from "react-router-dom"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetTeamsInfoAndCurrentIDQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { BaseProtectComponentProps } from "@/router/interface"
import { EMPTY_TEAM_PATH } from "@/utils/routeHelper"

const TeamCheck: FC<BaseProtectComponentProps> = (props) => {
  const { teamIdentifier } = useParams()
  const [searchParams] = useSearchParams()
  const myTeamIdentifier = searchParams.get("myTeamIdentifier")
  const mixedTeamIdentifier = myTeamIdentifier || teamIdentifier
  const { data, isSuccess, error } = useGetTeamsInfoAndCurrentIDQuery(
    mixedTeamIdentifier,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  )

  if (error && "status" in error) {
    if (error.status === 401) {
      TipisTrack.reset()
      window.location.href = `${getILLACloudURL(window.customDomain)}/user/login?redirectURL=${encodeURIComponent(
        window.location.href,
      )}`
      return null
    }
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

    TipisTrack.group(currentTeam.id, {
      name: currentTeam.name,
      identifier: currentTeam.identifier,
    })
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
