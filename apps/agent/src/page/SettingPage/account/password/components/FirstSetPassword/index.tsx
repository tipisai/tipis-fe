import { App } from "antd"
import { useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  useGetUserInfoQuery,
  useSendVerificationCodeToEmailMutation,
  useSetPasswordMutation,
} from "@illa-public/user-data"
import { TIPISStorage } from "@/utils/storage"
import { IFirstSetPasswordFields, IFirstSetPasswordMsg } from "./interface"
import SetPasswordMobile from "./mobile"
import SetPasswordPC from "./pc"

const FirstSetPassword = () => {
  const { t } = useTranslation()
  const { data: userInfo } = useGetUserInfoQuery(null)
  const { message } = App.useApp()
  const [showCountDown, setShowCountDown] = useState(false)
  const [setPassword] = useSetPasswordMutation()
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
      await setPassword({
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
            showCountDown={showCountDown}
            sendEmail={handleSendEmail}
            onCountDownChange={setShowCountDown}
            errorMsg={errorMsg}
            onSubmit={onFirstSetPasswordSubmit}
          />
        }
        mobilePage={
          <SetPasswordMobile
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
