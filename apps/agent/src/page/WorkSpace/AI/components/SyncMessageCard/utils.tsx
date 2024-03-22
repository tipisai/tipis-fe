import Icon from "@ant-design/icons"
import AnalyzeIcon from "@/assets/agent/message-analyze.svg?react"
import AnalyzeErrorIcon from "@/assets/agent/message-error.svg?react"
import AnalyzeStopIcon from "@/assets/agent/message-stop.svg?react"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import { infoIconStyle } from "./style"

export const getInfoByStatus = (status: MESSAGE_STATUS) => {
  let InfoIcon, InfoTitle
  switch (status) {
    case MESSAGE_STATUS.ANALYZE_SUCCESS: {
      InfoIcon = <Icon component={AnalyzeIcon} css={infoIconStyle} />
      InfoTitle = "Analyze success"
      break
    }
    case MESSAGE_STATUS.ANALYZE_FAILED: {
      InfoIcon = <Icon component={AnalyzeErrorIcon} css={infoIconStyle} />
      InfoTitle = "Analyze filed"
      break
    }
    case MESSAGE_STATUS.ANALYZE_STOP: {
      InfoIcon = <Icon component={AnalyzeStopIcon} css={infoIconStyle} />
      InfoTitle = "Stopped analyzing"
      break
    }
    default:
    case MESSAGE_STATUS.ANALYZE_PENDING: {
      InfoIcon = <Icon component={AnalyzeIcon} css={infoIconStyle} />
      InfoTitle = "Analyzing..."
      break
    }
  }
  return {
    InfoIcon,
    InfoTitle,
  }
}
