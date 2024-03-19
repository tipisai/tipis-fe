import { FC } from "react"
import { Navigate, useParams, useSearchParams } from "react-router-dom"
import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { useGetUserInfoAndTeamsInfoByTokenQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import i18n from "@/i18n"
import { AuthProps } from "./interface"

const ProtectedComponent: FC<AuthProps> = (props) => {
  const { teamIdentifier } = useParams()
  const [searchParams] = useSearchParams()
  const myTeamIdentifier = searchParams.get("myTeamIdentifier")
  const mixedTeamIdentifier = myTeamIdentifier || teamIdentifier
  const { data, isSuccess, error } = useGetUserInfoAndTeamsInfoByTokenQuery({
    teamIdentifier: mixedTeamIdentifier,
  })

  if (error && "status" in error) {
    if (error.status === 401) {
      ILLAMixpanel.reset()
      window.location.href = `${getILLACloudURL(window.customDomain)}/login?redirectURL=${encodeURIComponent(
        window.location.href,
      )}`
      return null
    }
    return <Navigate to="/404" />
  }

  if (data) {
    const currentLng = i18n.language
    ILLAMixpanel.setUserID(data.user.userID)
    const reportedUserInfo: Record<string, any> = {}
    Object.entries(data.user).forEach(([key, value]) => {
      reportedUserInfo[`illa_${key}`] = value
    })
    ILLAMixpanel.setUserProperties(reportedUserInfo)
    if (data.user.language && data.user.language !== currentLng) {
      i18n.changeLanguage(data.user.language)
      return null
    }

    let currentTeam
    if (mixedTeamIdentifier) {
      currentTeam = data.teams.find(
        (team) => team.identifier === mixedTeamIdentifier,
      )
      if (window.currentTeamIdentifier) {
        currentTeam = data.teams.find(
          (team) => team.identifier === window.currentTeamIdentifier,
        )
      }
      if (!currentTeam) {
        return <Navigate to="/403" />
      }
    } else {
      if (data.teams.length >= 0) {
        currentTeam = data.teams[0]
        return <Navigate to={`${currentTeam.identifier}`} />
      } else {
        return <Navigate to="/403" />
      }
    }

    ILLAMixpanel.setGroup(currentTeam.identifier)
    if (
      Array.isArray(props.needRole) &&
      props.needRole.length > 0 &&
      !props.needRole.includes(currentTeam.myRole)
    ) {
      return <Navigate to="/403" />
    }
  }

  return isSuccess ? (
    <>
      {props.children}
      <UpgradeModalGroup />
    </>
  ) : null
}

export default ProtectedComponent
