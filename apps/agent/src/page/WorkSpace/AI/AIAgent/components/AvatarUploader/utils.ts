import { App, GetProp, UploadProps } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

export const useBeforeUploadAvatar = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()

  const beforeUpload = useCallback(
    (file: Parameters<GetProp<UploadProps, "beforeUpload">>[0]) => {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      if (!isJpgOrPng) {
        message.error(t("homepage.edit_tipi.icon.type"))
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error(t("homepage.edit_tipi.icon.size"))
      }
      return isJpgOrPng && isLt2M
    },
    [message, t],
  )

  return beforeUpload
}
