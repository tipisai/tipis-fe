import { FC, useLayoutEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getAuthToken } from "@illa-public/utils"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { useAcceptInvite } from "../../utils/invite/hook"

const RootPage: FC = () => {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("inviteToken")
  const paramsRedirectURL = searchParams.get("redirectURL")

  const navigateWorkspace = useNavigateTargetWorkspace()

  const acceptInvite = useAcceptInvite()

  useLayoutEffect(() => {
    if (inviteToken) {
      acceptInvite(inviteToken, paramsRedirectURL)
    }
  }, [acceptInvite, inviteToken, paramsRedirectURL])

  useLayoutEffect(() => {
    if (!inviteToken && paramsRedirectURL) {
      const targetURL = new URL(decodeURIComponent(paramsRedirectURL))
      targetURL.searchParams.set("token", getAuthToken()!)
      window.location.href = targetURL.toString()
    }
  }, [inviteToken, paramsRedirectURL])

  useLayoutEffect(() => {
    if (!inviteToken && !paramsRedirectURL) {
      navigateWorkspace()
    }
  }, [inviteToken, navigateWorkspace, paramsRedirectURL])

  return null
}

export default RootPage
