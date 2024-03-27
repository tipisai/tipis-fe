import { App } from "antd"
import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { useSignInMutation } from "@illa-public/user-data"
import { setAuthToken } from "@illa-public/utils"
import { track } from "@/utils/mixpanelHelper"
import { LoginFields } from "../interface"
import { LoginErrorMsg } from "./interface"
import { MobileLogin } from "./mobile"
import { PCLogin } from "./pc"

const LoginPage: FC = () => {
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [errorMsg, setErrorMsg] = useState<LoginErrorMsg>({
    email: "",
    password: "",
  })

  const { message } = App.useApp()
  const [signIn] = useSignInMutation()

  const formProps = useForm<LoginFields>({
    defaultValues: {
      email: email ?? searchParams.get("email") ?? "",
    },
  })

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    setLoading(true)
    try {
      const { token } = await signIn(data).unwrap()
      if (!token) return
      setAuthToken(token)
      message.success({
        content: t("page.user.sign_in.tips.success"),
      })

      navigate(
        `/${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
      )
    } catch (e) {
      if (isILLAAPiError(e)) {
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_PASSWORD_INVALIED:
          case ERROR_FLAG.ERROR_FLAG_SIGN_IN_FAILED:
            message.error({
              content: t("page.user.sign_in.tips.fail_account"),
            })
            break
          default:
            message.error({
              content: t("page.user.sign_in.tips.fail"),
            })
            break
        }
        switch (e.data.errorMessage) {
          case "no such user":
            setErrorMsg({
              ...errorMsg,
              email: t("page.user.sign_in.error_message.email.registered"),
            })
            break
          case "invalid password":
            setErrorMsg({
              ...errorMsg,
              password: t("page.user.sign_in.error_message.password.incorrect"),
            })
            break
          default:
        }
      } else {
        message.warning({
          content: t("network_error"),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.VISIT, ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN)
  }, [])

  return (
    <>
      <Helmet>
        <title>{t("page.user.sign_in.title")}</title>
      </Helmet>
      <FormProvider {...formProps}>
        <MixpanelTrackProvider
          basicTrack={track}
          pageName={ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN}
        >
          <LayoutAutoChange
            desktopPage={
              <PCLogin
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={onSubmit}
                lockedEmail={email ?? searchParams.get("email") ?? ""}
              />
            }
            mobilePage={
              <MobileLogin
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={onSubmit}
                lockedEmail={email ?? searchParams.get("email") ?? ""}
              />
            }
          />
        </MixpanelTrackProvider>
      </FormProvider>
    </>
  )
}

export default LoginPage
