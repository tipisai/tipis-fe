import { App, Statistic } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import LinkButton from "../LinkButton"
import { EmailCodeProps } from "./interface"

const { Countdown } = Statistic

export const EmailCode: FC<EmailCodeProps> = (props) => {
  const { showCountDown, onCountDownChange, sendEmail } = props
  const { getValues, trigger } = useFormContext()
  const { t } = useTranslation()
  const { message } = App.useApp()

  const sendEmailCode = async () => {
    onCountDownChange(true)
    try {
      await sendEmail(getValues("email"))
      message.success(t("page.user.sign_up.tips.verification_code"))
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
    <LinkButton
      style={{
        height: "auto",
        border: "none",
      }}
      fontSize={14}
      onClick={handleClickSend}
    >
      {t("page.user.sign_up.actions.send")}
    </LinkButton>
  )
}
