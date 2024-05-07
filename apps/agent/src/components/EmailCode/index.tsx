import { App, Statistic, Typography } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { useSendVerificationCodeToEmailMutation } from "@illa-public/user-data"
import { TIPISStorage } from "@/utils/storage"
import { EmailCodeProps } from "./interface"

const { Countdown } = Statistic

export const EmailCode: FC<EmailCodeProps> = (props) => {
  const { showCountDown, onCountDownChange, usage } = props
  const { getValues, trigger } = useFormContext()
  const { t } = useTranslation()
  const { message } = App.useApp()
  const [sendVerificationCodeToEmail] = useSendVerificationCodeToEmailMutation()

  const sendEmailCode = async () => {
    onCountDownChange(true)
    try {
      const verificationToken = await sendVerificationCodeToEmail({
        email: getValues("email"),
        usage,
      }).unwrap()
      message.success(t("page.user.sign_up.tips.verification_code"))
      usage === "forgetpwd" &&
        TIPISStorage.setSessionStorage("verificationToken", verificationToken)
    } catch (error: any) {
      onCountDownChange(false)
      if (error?.response) {
        message.error(t("page.user.sign_up.tips.fail_sent"))
      }
      if (error?.response == undefined && error?.request != undefined) {
        message.warning(t("network_error"))
      }
    }
  }

  const handleClickSend = async () => {
    const canSend = await trigger("email")
    if (canSend) {
      sendEmailCode()
    }
  }
  return showCountDown ? (
    <Countdown
      value={Date.now() + 1000 * 60}
      format="ss"
      valueStyle={{
        fontSize: 14,
        color: getColor("techPurple", "03"),
      }}
      onFinish={() => {
        onCountDownChange(false)
      }}
    />
  ) : (
    <Typography.Link onClick={handleClickSend}>
      {t("page.user.sign_up.actions.send")}
    </Typography.Link>
  )
}
