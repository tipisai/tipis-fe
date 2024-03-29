import Icon from "@ant-design/icons"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import AnalyzeErrorIcon from "@/assets/agent/message-error.svg?react"
import AnalyzeStopIcon from "@/assets/agent/message-stop.svg?react"
import AnalyzeSuccess from "@/assets/agent/message-success.svg?react"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import runningCodeConfig from "@/config/lottieConfig/runningCode.json"
import { codeRunningStyle, infoIconStyle } from "./style"

export const useGetInfoByStatus = () => {
  const { t } = useTranslation()

  const getInfoByStatus = useCallback(
    (status: MESSAGE_STATUS) => {
      let InfoIcon, InfoTitle, infoDesc
      switch (status) {
        case MESSAGE_STATUS.ANALYZE_SUCCESS: {
          InfoIcon = <Icon component={AnalyzeSuccess} css={infoIconStyle} />
          InfoTitle = t("tipi_billing.python_runtime")
          infoDesc = t("tipi_billing.successfully_executed")
          break
        }
        case MESSAGE_STATUS.ANALYZE_FAILED: {
          InfoIcon = <Icon component={AnalyzeErrorIcon} css={infoIconStyle} />
          InfoTitle = t("tipi_billing.python_runtime")
          infoDesc = t("tipi_billing.failed_to_execute")
          break
        }
        case MESSAGE_STATUS.ANALYZE_STOP: {
          InfoIcon = <Icon component={AnalyzeStopIcon} css={infoIconStyle} />
          InfoTitle = t("tipi_billing.python_runtime")
          infoDesc = t("tipi_billing.stopped_executing")
          break
        }
        default:
        case MESSAGE_STATUS.ANALYZE_PENDING: {
          InfoIcon = (
            <div css={codeRunningStyle}>
              <LottieItem configJson={runningCodeConfig} autoplay loop />
            </div>
          )
          InfoTitle = t("tipi_billing.python_runtime")
          infoDesc = t("tipi_billing.executing")
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

  return getInfoByStatus
}
