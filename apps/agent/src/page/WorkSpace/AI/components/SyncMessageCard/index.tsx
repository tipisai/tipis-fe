import Icon from "@ant-design/icons"
import { AnimatePresence } from "framer-motion"
import { FC, useState } from "react"
import { DownIcon, UpIcon } from "@illa-public/icon"
// import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import MarkdownMessage from "../MarkdownMessage"
import {
  PureMessageProps,
  SyncMessageCardProps,
  SyncMessageResultProps,
} from "./interface"
import {
  containerStyle,
  headerContainerStyle,
  messageContainerStyle,
} from "./style"
import { getInfoByStatus } from "./utils"

export const PureMessage: FC<PureMessageProps> = ({ message }) => {
  return (
    <div css={messageContainerStyle}>
      <MarkdownMessage>{message}</MarkdownMessage>
    </div>
  )
}

export const SyncMessageResult: FC<SyncMessageResultProps> = ({ message }) => {
  let formatMessage
  try {
    formatMessage = `\`\`\`json\n${JSON.stringify(JSON.parse(message) || {}, null, 2)}\n\`\`\``
  } catch (e) {
    formatMessage = `\`\`\`json\n${message}\n\`\`\``
  }
  return (
    <div css={messageContainerStyle}>
      <MarkdownMessage>{formatMessage}</MarkdownMessage>
    </div>
  )
}

export const SyncMessageCard: FC<SyncMessageCardProps> = ({
  message,
  messageStatus,
}) => {
  const [showMessage, setShowMessage] = useState(false)

  let formatMessage
  try {
    const res = JSON.parse(message)
    if ("code" in res && !!res.code) {
      formatMessage = `\`\`\`python\n${res.code}\n\`\`\``
    } else {
      formatMessage = `\`\`\`json\n${JSON.parse(message)}\n\`\`\``
    }
  } catch (e) {
    formatMessage = `\`\`\`json\n${message}\n\`\`\``
  }

  const { InfoIcon, InfoTitle } = getInfoByStatus(messageStatus)

  // const hasResult =
  //   messageStatus === MESSAGE_STATUS.ANALYZE_SUCCESS ||
  //   messageStatus === MESSAGE_STATUS.ANALYZE_ERROR

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle(messageStatus)}
        onClick={() => setShowMessage(!showMessage)}
      >
        {InfoIcon}
        {InfoTitle}
        {/* {hasResult && <Icon component={showMessage ? UpIcon : DownIcon} />} */}
        <Icon component={showMessage ? UpIcon : DownIcon} />
      </div>
      <AnimatePresence>
        {showMessage && (
          <div css={messageContainerStyle}>
            <MarkdownMessage>{formatMessage}</MarkdownMessage>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
