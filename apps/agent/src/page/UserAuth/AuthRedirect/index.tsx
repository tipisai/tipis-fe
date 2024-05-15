import { App } from "antd"
import { FC, useCallback, useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useGetAuthSessionQuery } from "@illa-public/user-data"
import { setAuthToken } from "@illa-public/utils"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import { AUTH_PAGE_PATH } from "@/router/constants"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { AUTH_ERROR, AUTH_ERROR_PARAMS_KEY } from "./constants"
import { containerStyle, logoStyle } from "./style"

const AuthRedirect: FC = () => {
  const { data, isLoading } = useGetAuthSessionQuery(null)
  const [searchParams] = useSearchParams()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isErrorRedirectRef = useRef(false)
  const navigateWorkspace = useNavigateTargetWorkspace()

  // handle auth Error
  const errorHandler = useCallback(
    (error: AUTH_ERROR) => {
      switch (error) {
        case AUTH_ERROR.ACCESS_DENIED: {
          message.error(t("page.user.new_auth.auth_unfinished"))
          break
        }
        default: {
          message.error(t("page.user.new_auth.auth_failed"))
          break
        }
      }
    },
    [message, t],
  )

  useEffect(() => {
    const error = searchParams.get(AUTH_ERROR_PARAMS_KEY)
    if (error) {
      errorHandler(error as AUTH_ERROR)
      navigate(AUTH_PAGE_PATH)
      isErrorRedirectRef.current = true
    }
  }, [errorHandler, navigate, searchParams])

  useEffect(() => {
    if (isErrorRedirectRef.current) return
    if (!data?.session && !isLoading) {
      navigate(AUTH_PAGE_PATH)
    } else if (data?.session) {
      const { access_token: accessToken, token_type: tokenType } = data.session
      const capitalized = tokenType.charAt(0).toUpperCase() + tokenType.slice(1)
      setAuthToken(`${capitalized} ${accessToken}`)
      navigateWorkspace()
    }
  }, [data?.session, isLoading, navigate, navigateWorkspace])

  return (
    <>
      <Helmet>
        <title>{t("page.user.new_auth.title")}</title>
      </Helmet>
      <div css={containerStyle}>
        <TextAndLogo css={logoStyle} />
      </div>
    </>
  )
}

export default AuthRedirect
