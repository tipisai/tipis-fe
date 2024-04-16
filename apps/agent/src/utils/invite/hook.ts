import { App } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { useJoinTeamMutation } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import { useNavigateTargetWorkspace } from "../routeHelper/hook"
import { useRedirectToRedirectURL } from "../routeHelper/redirectHook"
import { setLocalTeamIdentifier } from "../storage/cacheTeam"

export const useAcceptInvite = () => {
  const [joinTeamMutation] = useJoinTeamMutation()
  const { message } = App.useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const navigateWorkspace = useNavigateTargetWorkspace()
  const redirect = useRedirectToRedirectURL()

  const acceptInvite = useCallback(
    async (inviteToken: string, redirectURL: string | undefined | null) => {
      try {
        const teamInfo = await joinTeamMutation(inviteToken).unwrap()
        message.success({ content: t("homepage.message.join_suc") })
        setLocalTeamIdentifier(teamInfo.identifier)
        if (redirectURL) {
          redirect(redirectURL)
        } else {
          navigate(`/workspace/${teamInfo.identifier}`)
        }
      } catch (e) {
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
              let redirectURLString = redirectURL
              if (redirectURLString) {
                let redirectURL = new URL(decodeURIComponent(redirectURLString))
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
      }
    },
    [joinTeamMutation, message, navigate, navigateWorkspace, redirect, t],
  )

  return acceptInvite
}
