import { App } from "antd"
import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import {
  useForgetPasswordMutation,
  useSendVerificationCodeToEmailMutation,
} from "@illa-public/user-data"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { TIPISStorage } from "@/utils/storage"
import { ResetPwdFields } from "../interface"
import { ResetPwdErrorMsg } from "./interface"
import { MobileReset } from "./mobile"
import { PCReset } from "./pc"

export const ResetPasswordPage: FC = () => {
  const [showCountDown, setShowCountDown] = useState(false)
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [forgetPassword] = useForgetPasswordMutation()
  const [sendVerificationCodeToEmail] = useSendVerificationCodeToEmailMutation()

  const formProps = useForm<ResetPwdFields>({
    mode: "onSubmit",
    criteriaMode: "firstError",
    defaultValues: {
      email: email ?? searchParams.get("email") ?? "",
    },
  })

  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<ResetPwdErrorMsg>({})

  const onSubmit: SubmitHandler<ResetPwdFields> = async (data) => {
    const verificationToken = TIPISStorage.getSessionStorage(
      "verificationToken",
    ) as string
    setLoading(true)
    try {
      await forgetPassword({
        verificationToken,
        ...data,
      })

      navigate(LOGIN_PATH)
      message.success({
        content: t("page.user.forgot_password.tips.success"),
      })
    } catch (e) {
      if (isILLAAPiError(e)) {
        message.error({
          content: t("page.user.forgot_password.tips.fail"),
        })

        switch (e.data.errorMessage) {
          case "no such user":
            setErrorMsg({
              ...errorMsg,
              email: t(
                "page.user.forgot_password.error_message.email.registered",
              ),
            })
            break
          case "invalid verification code":
            setErrorMsg({
              ...errorMsg,
              verificationCode: t(
                "page.user.forgot_password.error_message.verification_code.invalid",
              ),
            })
            break
          default:
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (email: string) => {
    try {
      const verificationToken = await sendVerificationCodeToEmail({
        email,
        usage: "forgetpwd",
      }).unwrap()
      TIPISStorage.setSessionStorage("verificationToken", verificationToken)
    } catch (e) {}
  }

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.FORGET_PASSWORD)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.FORGET_PASSWORD)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t("meta.forget_password_meta_title")}</title>
      </Helmet>
      <FormProvider {...formProps}>
        <LayoutAutoChange
          desktopPage={
            <PCReset
              loading={loading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              sendEmail={handleSendEmail}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
              showCountDown={showCountDown}
              onCountDownChange={setShowCountDown}
            />
          }
          mobilePage={
            <MobileReset
              loading={loading}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              sendEmail={handleSendEmail}
              lockedEmail={email ?? searchParams.get("email") ?? ""}
              showCountDown={showCountDown}
              onCountDownChange={setShowCountDown}
            />
          }
        />
      </FormProvider>
    </>
  )
}

export default ResetPasswordPage
