import Icon from "@ant-design/icons"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { CloseIcon } from "@illa-public/icon"
import ReadFileIcon from "@/assets/agent/message-file.svg?react"
import RunPythonIcon from "@/assets/agent/message-python.svg?react"
import GetTimeIcon from "@/assets/agent/message-time.svg?react"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import reading from "@/config/lottieConfig/reading.json"
import runningPythonCode from "@/config/lottieConfig/runningPythonCode.json"
import { RUN_REQUEST_TYPE } from "./constants"
import { infoIconStyle } from "./style"

export const useGetInfoByStatus = () => {
  const { t } = useTranslation()

  const getRunPythonInfoByStatus = useCallback(
    (status: MESSAGE_STATUS) => {
      let InfoIcon, InfoTitle, infoDesc
      switch (status) {
        case MESSAGE_STATUS.ANALYZE_SUCCESS: {
          InfoIcon = <Icon component={RunPythonIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.python")
          infoDesc = t("homepage.tipi_chat.processing_status.suc")
          break
        }
        case MESSAGE_STATUS.ANALYZE_FAILED: {
          InfoIcon = <Icon component={RunPythonIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.python")
          infoDesc = t("homepage.tipi_chat.processing_status.failed")
          break
        }
        case MESSAGE_STATUS.ANALYZE_STOP: {
          InfoIcon = <Icon component={CloseIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.python")
          infoDesc = t("homepage.tipi_chat.processing_status.stopped")
          break
        }

        default:
        case MESSAGE_STATUS.ANALYZE_PENDING: {
          InfoIcon = <LottieItem configJson={runningPythonCode} autoplay loop />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.python")
          infoDesc = t("homepage.tipi_chat.processing_status.processing")
          break
        }
      }
      return {
        InfoIcon,
        InfoTitle,
        infoDesc,
      }
    },
    [t],
  )

  const getReadFileInfoByStatus = useCallback(
    (status: MESSAGE_STATUS) => {
      let InfoIcon, InfoTitle, infoDesc
      switch (status) {
        case MESSAGE_STATUS.ANALYZE_SUCCESS: {
          InfoIcon = <Icon component={ReadFileIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.read_file")
          infoDesc = t("homepage.tipi_chat.processing_status.suc")
          break
        }
        case MESSAGE_STATUS.ANALYZE_FAILED: {
          InfoIcon = <Icon component={ReadFileIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.read_file")
          infoDesc = t("homepage.tipi_chat.processing_status.failed")
          break
        }
        case MESSAGE_STATUS.ANALYZE_STOP: {
          InfoIcon = <Icon component={CloseIcon} css={infoIconStyle} />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.read_file")
          infoDesc = t("homepage.tipi_chat.processing_status.stopped")
          break
        }

        default:
        case MESSAGE_STATUS.ANALYZE_PENDING: {
          InfoIcon = <LottieItem configJson={reading} autoplay loop />
          InfoTitle = t("homepage.tipi_chat.processing_status.title.read_file")
          infoDesc = t("homepage.tipi_chat.processing_status.processing")
          break
        }
      }
      return {
        InfoIcon,
        InfoTitle,
        infoDesc,
      }
    },
    [t],
  )

  const getTimeInfoByStatue = useCallback(
    (status: MESSAGE_STATUS) => {
      let InfoIcon, InfoTitle, infoDesc
      switch (status) {
        case MESSAGE_STATUS.ANALYZE_SUCCESS: {
          InfoIcon = <Icon component={GetTimeIcon} css={infoIconStyle} />
          InfoTitle = t(
            "homepage.tipi_chat.processing_status.title.current_time",
          )
          infoDesc = t("homepage.tipi_chat.processing_status.suc")
          break
        }
        case MESSAGE_STATUS.ANALYZE_FAILED: {
          InfoIcon = <Icon component={GetTimeIcon} css={infoIconStyle} />
          InfoTitle = t(
            "homepage.tipi_chat.processing_status.title.current_time",
          )
          infoDesc = t("homepage.tipi_chat.processing_status.failed")
          break
        }
        case MESSAGE_STATUS.ANALYZE_STOP: {
          InfoIcon = <Icon component={CloseIcon} css={infoIconStyle} />
          InfoTitle = t(
            "homepage.tipi_chat.processing_status.title.current_time",
          )
          infoDesc = t("homepage.tipi_chat.processing_status.stopped")
          break
        }

        default:
        case MESSAGE_STATUS.ANALYZE_PENDING: {
          InfoIcon = <LottieItem configJson={reading} autoplay loop />
          InfoTitle = t(
            "homepage.tipi_chat.processing_status.title.current_time",
          )
          infoDesc = t("homepage.tipi_chat.processing_status.processing")
          break
        }
      }
      return {
        InfoIcon,
        InfoTitle,
        infoDesc,
      }
    },
    [t],
  )

  const getInfoByStatus = useCallback(
    (status: MESSAGE_STATUS, runRequestType: RUN_REQUEST_TYPE | undefined) => {
      switch (runRequestType) {
        case RUN_REQUEST_TYPE._SYS_READ_FILE: {
          return getReadFileInfoByStatus(status)
        }
        case RUN_REQUEST_TYPE._SYS_GET_CURRENT_TIME_IN_UTC: {
          return getTimeInfoByStatue(status)
        }
        default:
        case RUN_REQUEST_TYPE._SYS_RUN_PYTHON_CODE: {
          return getRunPythonInfoByStatus(status)
        }
      }
    },
    [getReadFileInfoByStatus, getRunPythonInfoByStatus, getTimeInfoByStatue],
  )

  return getInfoByStatus
}
