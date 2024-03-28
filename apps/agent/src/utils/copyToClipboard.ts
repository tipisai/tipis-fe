import { App } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { COPY_STATUS, copyToClipboard as copy } from "@illa-public/utils"
import i18n from "@/i18n"
import { message } from "./antdStore"

export const useCopyToClipboard = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()

  const copyToClipboard = useCallback(
    (text: string) => {
      const flag = copy(text)
      if (flag === COPY_STATUS.EMPTY) {
        message.info({
          content: t("empty_copied_tips"),
        })
      } else {
        message.success({
          content: t("copied"),
        })
      }
    },
    [message, t],
  )

  return copyToClipboard
}

export const copyToClipboard = (text: string) => {
  const flag = copy(text)
  if (flag === COPY_STATUS.EMPTY) {
    message.info({
      content: i18n.t("empty_copied_tips"),
    })
  } else {
    message.success({
      content: i18n.t("copied"),
    })
  }
}
