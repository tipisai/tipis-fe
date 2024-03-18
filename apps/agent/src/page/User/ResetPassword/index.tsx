import { App } from "antd"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  useForgetPasswordMutation,
  useSendVerificationCodeToEmailMutation,
} from "@illa-public/user-data"
import { track } from "@/utils/mixpanelHelper"
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
      track(
        ILLA_MIXPANEL_EVENT_TYPE.VALIDATE,
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
        { element: "send_code", parameter2: "suc" },
      )
      track(
        ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
        { element: "reset_password", parameter2: "suc" },
      )
      navigate(LOGIN_PATH)
      message.success({
        content: t("page.user.forgot_password.tips.success"),
      })
    } catch (e) {
      if (isILLAAPiError(e)) {
        message.error({
          content: t("page.user.forgot_password.tips.fail"),
        })
        track(
          ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
          ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
          {
            element: "reset_password",
            parameter2: "failed",
            parameter3: e.data?.errorMessage,
          },
        )
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
            track(
              ILLA_MIXPANEL_EVENT_TYPE.VALIDATE,
              ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
              {
                element: "send_code",
                parameter2: "failed",
                parameter3: "invalid_code",
              },
            )
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
  return (
    <FormProvider {...formProps}>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD}
      >
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
      </MixpanelTrackProvider>
    </FormProvider>
  )
}

export default ResetPasswordPage
