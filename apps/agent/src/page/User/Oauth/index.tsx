import { App } from "antd"
import { FC, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
} from "@illa-public/mixpanel-utils"
import { Page404 } from "@illa-public/status-page"
import { useExchangeTokenMutation } from "@illa-public/user-data"
import { getAuthToken, sendTagEvent, setAuthToken } from "@illa-public/utils"
import { linkTrk, rdtSignUpTrk, twqTrk } from "@/utils/gaHelper"
import { LINKEDIN_CONVERSION_ID, TWITTER_ID } from "@/utils/gaHelper/constent"
import { track } from "@/utils/mixpanelHelper"
import { TIPISStorage } from "@/utils/storage"
import { mobilePageStyle, pageStyle } from "./style"

const OAuth: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const [searchParams] = useSearchParams()
  const state = searchParams.get("state")
  const code = searchParams.get("code")
  const redirectURL = searchParams.get("redirectURL")
  const [exchangeToken] = useExchangeTokenMutation()

  useEffect(() => {
    if (code && state) {
      const landing = JSON.parse(state)?.landing
      const currentTime = new Date().getTime()

      exchangeToken({
        oauthAgency: "github",
        code,
        state,
      })
        .unwrap()
        .then((res) => {
          const token = res.token
          token && setAuthToken(token)
          const isNewUser = res?.isNewUser
          switch (landing) {
            case "connect":
              message.success(t("profile.setting.oauth.message.github"))
              navigate("/setting/linked")
              break
            case "signin": {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN,
                {
                  element: "github_sign_in",
                  consume: new Date().getTime() - currentTime,
                  parameter2: "suc",
                  parameter3: !!isNewUser,
                },
              )
              if (isNewUser) {
                sendTagEvent("sign_up", res?.userID)
                linkTrk(LINKEDIN_CONVERSION_ID.SIGNUP)
                twqTrk(TWITTER_ID.SIGNUP, res?.userID)
                rdtSignUpTrk(res?.userID)
              }
              message.success({
                content: t("page.user.sign_in.tips.success"),
              })
              if (redirectURL) {
                const finalRedirectURL = new URL(
                  decodeURIComponent(redirectURL),
                )
                finalRedirectURL.searchParams.set("token", getAuthToken() ?? "")
                window.location.assign(finalRedirectURL.toString())
              } else {
                navigate("/workspace")
              }
              break
            }
            case "signup": {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
                {
                  element: "github_sign_up",
                  consume: new Date().getTime() - currentTime,
                  parameter2: "suc",
                  parameter3: !!isNewUser,
                },
              )
              if (isNewUser) {
                sendTagEvent("sign_up", res?.userID)
                linkTrk(LINKEDIN_CONVERSION_ID.SIGNUP)
                twqTrk(TWITTER_ID.SIGNUP, res?.userID)
                rdtSignUpTrk(res?.userID)
              }
              if (!TIPISStorage.getLocalStorage("hasOpenedSurvey")) {
                TIPISStorage.setLocalStorage("operation", "open_survey")
              }
              message.success({
                content: t("page.user.sign_in.tips.success"),
              })
              if (redirectURL) {
                const finalRedirectURL = new URL(
                  decodeURIComponent(redirectURL),
                )
                finalRedirectURL.searchParams.set("token", getAuthToken() ?? "")
                window.location.assign(finalRedirectURL.toString())
              } else {
                navigate("/workspace")
              }
              break
            }
            default:
              break
          }
        })
        .catch((error: unknown) => {
          if (isILLAAPiError(error)) {
            const errorFlag = error.data.errorFlag
            switch (error.data.errorFlag) {
              case ERROR_FLAG.ERROR_FLAG_OAUTH_FETCH_USER_INFO_FAILED: {
                message.error({
                  content: t("page.user.sign_in.message.github_no_user_name"),
                })
                break
              }
              case ERROR_FLAG.ERROR_FLAG_OAUTH_CONNECT_FAILED: {
                message.error({
                  content: t(
                    "profile.setting.oauth.message.auth_failed_email_not_match",
                  ),
                })
                break
              }
              default: {
                message.error({
                  content: t("profile.setting.oauth.message.auth_failed"),
                })
                break
              }
            }
            switch (landing) {
              case "signin":
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                  ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN,
                  {
                    element: "github_sign_in",
                    consume: new Date().getTime() - currentTime,
                    parameter2: "failed",
                    parameter3: errorFlag,
                  },
                )
                navigate(`/login`)
                break
              case "signup":
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                  ILLA_MIXPANEL_PUBLIC_PAGE_NAME.SIGNUP,
                  {
                    element: "github_sign_up",
                    consume: new Date().getTime() - currentTime,
                    parameter2: "failed",
                    parameter3: errorFlag,
                  },
                )
                navigate(`/register`)
                break
              case "connect":
                navigate(`/setting/linked`)
                break
              default:
                navigate("/workspace")
            }
          }
        })
    }
  }, [code, exchangeToken, message, navigate, redirectURL, state, t])

  if (!code && !state) {
    return <Page404 />
  }

  return (
    <LayoutAutoChange
      desktopPage={<div css={pageStyle}>Redirecting..</div>}
      mobilePage={<div css={mobilePageStyle}>Redirecting..</div>}
    />
  )
}

export default OAuth
OAuth.displayName = "OAuth"
