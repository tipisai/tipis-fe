import { App, GetProp, UploadProps } from "antd"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TipisTrack } from "@illa-public/track-utils"

export const useBeforeUploadAvatar = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const { getValues } = useFormContext()

  const beforeUpload = useCallback(
    (file: Parameters<GetProp<UploadProps, "beforeUpload">>[0]) => {
      TipisTrack.track("click_upload_tipi_icon_entry", {
        parameter1: getValues("aiAgentID") ? "edit" : "create",
      })
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      if (!isJpgOrPng) {
        message.error(t("homepage.edit_tipi.icon.type"))
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        TipisTrack.track("upload_tipi_icon_over_size", {
          parameter1: getValues("aiAgentID") ? "edit" : "create",
          parameter3: file.size,
        })
        message.error(t("homepage.edit_tipi.icon.size"))
      }
      return isJpgOrPng && isLt2M
    },
    [getValues, message, t],
  )

  return beforeUpload
}
