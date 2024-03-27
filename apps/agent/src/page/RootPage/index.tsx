import { App } from "antd"
import { FC, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { useJoinTeamMutation } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"

const RootPage: FC = () => {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("inviteToken")
  const paramsRedirectURL = searchParams.get("redirectURL")
  const [joinTeamMutation] = useJoinTeamMutation()
  const { message } = App.useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const navigateWorkspace = useNavigateTargetWorkspace()

  useLayoutEffect(() => {
    if (inviteToken) {
      joinTeamMutation(inviteToken)
        .unwrap()
        .then((teamInfo) => {
          message.success({ content: t("homepage.message.join_suc") })
          setLocalTeamIdentifier(teamInfo.identifier)
          if (paramsRedirectURL) {
            let redirectURL = new URL(decodeURIComponent(paramsRedirectURL))
            redirectURL.searchParams.set("token", getAuthToken()!)
            window.location.href = redirectURL.toString()
          } else {
            navigate(`/workspace/${teamInfo.identifier}`)
          }
        })
        .catch((e) => {
          if (isILLAAPiError(e)) {
            switch (e.data.errorFlag) {
              case ERROR_FLAG.ERROR_FLAG_INVITE_EMAIL_MISMATCH: {
                message.error({
                  content: t("homepage.message.join_failed"),
                })
                break
              }
              case ERROR_FLAG.ERROR_FLAG_USER_ALREADY_JOINED_TEAM: {
                message.error({
                  content: t("homepage.message.have_joined"),
                })
                let redirectURLString = searchParams.get("redirectURL")
                if (redirectURLString) {
                  let redirectURL = new URL(
                    decodeURIComponent(redirectURLString),
                  )
                  redirectURL.searchParams.set("token", getAuthToken()!)
                  window.location.href = redirectURL.toString()
                  return
                }
                break
              }
              default: {
                message.error({
                  content: t("homepage.message.join_failed_other_error"),
                })
              }
            }
            navigateWorkspace()
          } else {
            navigateWorkspace()
            message.error({
              content: t("homepage.message.join_failed_other_error"),
            })
          }
        })
    }
  }, [
    inviteToken,
    joinTeamMutation,
    message,
    navigate,
    navigateWorkspace,
    paramsRedirectURL,
    searchParams,
    t,
  ])

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
