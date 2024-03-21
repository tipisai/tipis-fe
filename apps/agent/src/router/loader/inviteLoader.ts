import { LoaderFunctionArgs } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { authAPI } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import i18n from "@/i18n"
import store from "@/redux/store"
import { message } from "@/utils/antdStore"
import { setLocalCurrentTeamID } from "@/utils/auth"

export const inviteLoader = async (args: LoaderFunctionArgs) => {
  const { request } = args
  const url = new URL(request.url)
  const inviteToken = url.searchParams.get("inviteToken")
  if (!inviteToken) return null
  try {
    const response = await store
      .dispatch(authAPI.endpoints.joinTeam.initiate(inviteToken))
      .unwrap()
    message.success({ content: i18n.t("homepage.message.join_suc") })
    const invitedTeamInfo = response
    setLocalCurrentTeamID(invitedTeamInfo.id)
    let redirectURLString = url.searchParams.get("redirectURL")
    if (redirectURLString) {
      let redirectURL = new URL(decodeURIComponent(redirectURLString))
      redirectURL.searchParams.set("token", getAuthToken()!)
      return redirectURL.toString()
    } else {
      return `/workspace/${invitedTeamInfo.identifier}`
    }
  } catch (e) {
    if (isILLAAPiError(e)) {
      switch (e.data.errorFlag) {
        case ERROR_FLAG.ERROR_FLAG_INVITE_EMAIL_MISMATCH: {
          message.error({
            content: i18n.t("homepage.message.join_failed"),
          })
          break
        }
        case ERROR_FLAG.ERROR_FLAG_USER_ALREADY_JOINED_TEAM: {
          message.error({
            content: i18n.t("homepage.message.have_joined"),
          })
          let redirectURLString = url.searchParams.get("redirectURL")
          if (redirectURLString) {
            let redirectURL = new URL(decodeURIComponent(redirectURLString))
            redirectURL.searchParams.set("token", getAuthToken()!)
            return redirectURL.toString()
          }
          break
        }
        default: {
          message.error({
            content: i18n.t("homepage.message.join_failed_other_error"),
          })
        }
      }
      return
    }
    message.success({
      content: i18n.t("homepage.message.join_failed_other_error"),
    })
  }
  return null
}
