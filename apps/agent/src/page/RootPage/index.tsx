import { FC, useLayoutEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { useAcceptInvite } from "../../utils/invite/hook"
import { useRedirectToRedirectURL } from "../../utils/routeHelper/redirectHook"

const RootPage: FC = () => {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("inviteToken")
  const paramsRedirectURL = searchParams.get("redirectURL")

  const navigateWorkspace = useNavigateTargetWorkspace()

  const acceptInvite = useAcceptInvite()
  const redirect = useRedirectToRedirectURL()

  useLayoutEffect(() => {
    if (inviteToken) {
      acceptInvite(inviteToken, paramsRedirectURL)
    }
  }, [acceptInvite, inviteToken, paramsRedirectURL])

  useLayoutEffect(() => {
    if (!inviteToken && paramsRedirectURL) {
      redirect(paramsRedirectURL)
    }
  }, [inviteToken, paramsRedirectURL, redirect])

  useLayoutEffect(() => {
    if (!inviteToken && !paramsRedirectURL) {
      navigateWorkspace()
    }
  }, [inviteToken, navigateWorkspace, paramsRedirectURL])

  return null
}

export default RootPage
