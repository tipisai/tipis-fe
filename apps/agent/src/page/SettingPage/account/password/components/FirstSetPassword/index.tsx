import { App } from "antd"
import { useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  getCurrentUser,
  useForgetPasswordMutation,
  useSendVerificationCodeToEmailMutation,
} from "@illa-public/user-data"
import { TIPISStorage } from "@/utils/storage"
import { IFirstSetPasswordFields, IFirstSetPasswordMsg } from "./interface"
import SetPasswordMobile from "./mobile"
import SetPasswordPC from "./pc"

const FirstSetPassword = () => {
  const { t } = useTranslation()
  const userInfo = useSelector(getCurrentUser)
  const { message } = App.useApp()
  const [showCountDown, setShowCountDown] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [forgetPassword] = useForgetPasswordMutation()
  const [sendVerificationCodeToEmail] = useSendVerificationCodeToEmailMutation()
  const firstSetPasswordForm = useForm<IFirstSetPasswordFields>({
    defaultValues: {
      email: userInfo?.email,
    },
  })

  const [errorMsg, setErrorMsg] = useState<IFirstSetPasswordMsg>({
    email: "",
    verificationCode: "",
  })

  const onFirstSetPasswordSubmit: SubmitHandler<
    IFirstSetPasswordFields
  > = async (data) => {
    const verificationToken = TIPISStorage.getSessionStorage(
      "verificationToken",
    ) as string
    try {
      setPasswordLoading(true)
      await forgetPassword({
        verificationToken,
        ...data,
        isFirstSet: true,
      })
      message.success(t("profile.setting.message.save_suc"))
    } catch (e) {
      if (isILLAAPiError(e)) {
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_VALIDATE_VERIFICATION_CODE_FAILED:
            message.error(
              t("page.user.sign_up.error_message.verification_code.invalid"),
            )
            break
          default:
            message.error(t("profile.setting.message.save_fail"))
            break
        }
        switch (e.data.errorMessage) {
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
      setPasswordLoading(false)
    }
  }

  const handleSendEmail = async (email: string) => {
    try {
      await sendVerificationCodeToEmail({
        email,
        usage: "forgetpwd",
      })
    } catch (e) {}
  }
  return (
    <FormProvider {...firstSetPasswordForm}>
      <LayoutAutoChange
        desktopPage={
          <SetPasswordPC
            loading={passwordLoading}
            showCountDown={showCountDown}
            sendEmail={handleSendEmail}
            onCountDownChange={setShowCountDown}
            errorMsg={errorMsg}
            onSubmit={onFirstSetPasswordSubmit}
          />
        }
        mobilePage={
          <SetPasswordMobile
            loading={passwordLoading}
            showCountDown={showCountDown}
            sendEmail={handleSendEmail}
            onCountDownChange={setShowCountDown}
            errorMsg={errorMsg}
            onSubmit={onFirstSetPasswordSubmit}
          />
        }
      />
    </FormProvider>
  )
}

export default FirstSetPassword
