import Icon from "@ant-design/icons"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { CloseIcon } from "@illa-public/icon"
import RunPythonIcon from "@/assets/agent/message-python.svg?react"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/_PreviewChatCache/interface"
import RunningPythonCodeIcon from "@/config/lottieConfig/runningPythonCode.json"
import { infoIconStyle, stopIconStyle } from "./style"

export const useGetInfoByStatus = () => {
  const { t } = useTranslation()

  const getAIToolInfoByStatue = useCallback(
    (status: MESSAGE_STATUS, name: string) => {
      let InfoIcon, infoTitle, infoDesc
      switch (status) {
        case MESSAGE_STATUS.ANALYZE_SUCCESS: {
          InfoIcon = <Icon component={RunPythonIcon} css={infoIconStyle} />
          infoTitle = name
          infoDesc = t("homepage.tipi_chat.processing_status.suc")
          break
        }
        case MESSAGE_STATUS.ANALYZE_FAILED: {
          InfoIcon = <Icon component={RunPythonIcon} css={infoIconStyle} />
          infoTitle = name
          infoDesc = t("homepage.tipi_chat.processing_status.failed")
          break
        }
        case MESSAGE_STATUS.ANALYZE_STOP: {
          InfoIcon = <Icon component={CloseIcon} css={stopIconStyle} />
          infoTitle = name
          infoDesc = t("homepage.tipi_chat.processing_status.stopped")
          break
        }

        default:
        case MESSAGE_STATUS.ANALYZE_PENDING: {
          InfoIcon = (
            <LottieItem
              configJson={RunningPythonCodeIcon}
              autoplay
              loop
              size={24}
            />
          )
          infoTitle = name
          infoDesc = t("homepage.tipi_chat.processing_status.processing")
          break
        }
      }
      return {
        InfoIcon,
        infoTitle,
        infoDesc,
      }
    },
    [t],
  )

  return getAIToolInfoByStatue
}
