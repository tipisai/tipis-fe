import { App } from "antd"
import { FC, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Page404 } from "@illa-public/status-page"
import { useExchangeTokenMutation } from "@illa-public/user-data"
import { getAuthToken, setAuthToken } from "@illa-public/utils"
import { LINKED_PATH, LOGIN_PATH, REGISTER_PATH } from "@/utils/routeHelper"
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

      exchangeToken({
        oauthAgency: "github",
        code,
        state,
      })
        .unwrap()
        .then((res) => {
          const token = res.token
          token && setAuthToken(token)
          // const isNewUser = res?.isNewUser
          switch (landing) {
            case "connect":
              message.success(t("profile.setting.oauth.message.github"))
              navigate(LINKED_PATH)
              break
            case "signin": {
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
            // const errorFlag = error.data.errorFlag
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
                navigate(LOGIN_PATH)
                break
              case "signup":
                navigate(REGISTER_PATH)
                break
              case "connect":
                navigate(LINKED_PATH)
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
