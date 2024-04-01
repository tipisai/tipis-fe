import { App } from "antd"
import { FC, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  useSendVerificationCodeToEmailMutation,
  useSignUpMutation,
} from "@illa-public/user-data"
import { setAuthToken } from "@illa-public/utils"
import { getLocalLanguage } from "@/i18n"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { TIPISStorage } from "@/utils/storage"
import { RegisterFields } from "../interface"
import { RegisterErrorMsg } from "./interface"
import { MobileRegister } from "./mobile"
import { PCRegister } from "./pc"

const RegisterPage: FC = () => {
  const [showCountDown, setShowCountDown] = useState(false)
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [signUp] = useSignUpMutation()
  const [sendVerificationCodeToEmail] = useSendVerificationCodeToEmailMutation()
  const navigateToWorkspace = useNavigateTargetWorkspace()

  const formProps = useForm<RegisterFields>({
    defaultValues: {
      isSubscribed: true,
      email: email ?? searchParams.get("email") ?? "",
    },
  })

  const { message } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<RegisterErrorMsg>({
    email: "",
    verificationCode: "",
  })

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    const verificationToken = TIPISStorage.getSessionStorage(
      "verificationToken",
    ) as string
    const inviteToken = searchParams.get("inviteToken")
    try {
      setLoading(true)
      const res = await signUp({
        inviteToken,
        verificationToken,
        language: getLocalLanguage(),
        ...data,
      }).unwrap()

      const token = res.token
      if (!token) return
      message.success(t("page.user.sign_up.tips.success"))
      setAuthToken(token)
      searchParams.delete("inviteToken")
      await navigateToWorkspace()
    } catch (e) {
      if (isILLAAPiError(e)) {
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_EMAIL_HAS_BEEN_TAKEN:
            message.error(t("page.user.sign_up.error_message.email.registered"))
            break
          case ERROR_FLAG.ERROR_FLAG_VALIDATE_VERIFICATION_CODE_FAILED:
            message.error(
              t("page.user.sign_up.error_message.verification_code.invalid"),
            )
            break
          default:
            message.error(t("page.user.sign_up.tips.fail"))
            break
        }
        switch (e.data.errorMessage) {
          case "duplicate email address":
            setErrorMsg({
              ...errorMsg,
              email: t("page.user.sign_up.error_message.email.registered"),
            })
            break
          case "invalid verification code":
            setErrorMsg({
              ...errorMsg,
              verificationCode: t(
                "page.user.sign_up.error_message.verification_code.invalid",
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
      await sendVerificationCodeToEmail({
        email,
        usage: "signup",
      })
    } catch (e) {}
  }
  return (
    <>
      <Helmet>
        <title>{t("meta.register_meta_title")}</title>
      </Helmet>
      <FormProvider {...formProps}>
        <LayoutAutoChange
          desktopPage={
            <PCRegister
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
            <MobileRegister
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

export default RegisterPage
