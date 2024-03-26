import { FC } from "react"
import { Navigate, useParams, useSearchParams } from "react-router-dom"
import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { useGetTeamsInfoAndCurrentIDQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { BaseProtectComponentProps } from "@/router/interface"
import { getLocalTeamIdentifier, setLocalTeamIdentifier } from "@/utils/auth"
import { EMPTY_TEAM_PATH } from "@/utils/routeHelper"

const TeamCheck: FC<BaseProtectComponentProps> = (props) => {
  const { teamIdentifier } = useParams()
  const [searchParams] = useSearchParams()
  const myTeamIdentifier = searchParams.get("myTeamIdentifier")
  const localTeamIdentifier = getLocalTeamIdentifier() as string | undefined
  const mixedTeamIdentifier =
    myTeamIdentifier || teamIdentifier || localTeamIdentifier

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
      ILLAMixpanel.reset()
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
    if (!teamIdentifier) {
      return <Navigate to={`${data.teams[0].identifier}`} />
    }

    if (!data.currentTeamID) {
      return <Navigate to="/403" />
    }

    const currentTeam = data.currentTeamInfo!

    setLocalTeamIdentifier(currentTeam.identifier)

    ILLAMixpanel.setGroup(currentTeam.identifier)
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
