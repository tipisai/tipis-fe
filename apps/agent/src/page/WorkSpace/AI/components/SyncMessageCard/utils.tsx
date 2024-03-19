import Icon from "@ant-design/icons"
import AnalyzeIcon from "@/assets/agent/message-analyze.svg?react"
import AnalyzeErrorIcon from "@/assets/agent/message-error.svg?react"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import { infoIconStyle } from "./style"

export const getInfoByStatus = (status: MESSAGE_STATUS) => {
  let InfoIcon, InfoTitle
  switch (status) {
    case MESSAGE_STATUS.ANALYZE_ERROR: {
      InfoIcon = <Icon component={AnalyzeErrorIcon} css={infoIconStyle} />
      InfoTitle = "Execution failed"
      break
    }

    case MESSAGE_STATUS.ANALYZE_SUCCESS: {
      InfoIcon = <Icon component={AnalyzeIcon} css={infoIconStyle} />
      InfoTitle = "analyze end"
      break
    }

    default:
    case MESSAGE_STATUS.ANALYZE_PENDING: {
      InfoIcon = <Icon component={AnalyzeIcon} css={infoIconStyle} />
      InfoTitle = "analyzing..."
      break
    }
  }
  return {
    InfoIcon,
    InfoTitle,
  }
}
