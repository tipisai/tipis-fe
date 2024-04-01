import { App } from "antd"
import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { useSignInMutation } from "@illa-public/user-data"
import { setAuthToken } from "@illa-public/utils"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { LoginFields } from "../interface"
import { LoginErrorMsg } from "./interface"
import { MobileLogin } from "./mobile"
import { PCLogin } from "./pc"

const LoginPage: FC = () => {
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const navigateToWorkspace = useNavigateTargetWorkspace()

  const [errorMsg, setErrorMsg] = useState<LoginErrorMsg>({
    email: "",
    password: "",
  })

  const { message } = App.useApp()
  const [signIn, { isLoading }] = useSignInMutation()

  const formProps = useForm<LoginFields>({
    defaultValues: {
      email: email ?? searchParams.get("email") ?? "",
    },
  })

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    try {
      const { token } = await signIn(data).unwrap()
      if (!token) return
      setAuthToken(token)
      message.success({
        content: t("page.user.sign_in.tips.success"),
      })
      await navigateToWorkspace()
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
    }
  }

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.LOGIN)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.LOGIN)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t("meta.login_meta_title")}</title>
      </Helmet>
      <FormProvider {...formProps}>
        <LayoutAutoChange
          desktopPage={
            <PCLogin
              loading={isLoading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
            />
          }
          mobilePage={
            <MobileLogin
              loading={isLoading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
            />
          }
        />
      </FormProvider>
    </>
  )
}

export default LoginPage
