import Icon from "@ant-design/icons"
import { AnimatePresence } from "framer-motion"
import { FC, useState } from "react"
import { DownIcon, UpIcon } from "@illa-public/icon"
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
  if (!message) return null
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
    const code = res?.["function_arguments"]?.["code"]
    if (code) {
      formatMessage = `\`\`\`python\n${code}\n\`\`\``
    } else {
      formatMessage = `\`\`\`json\n${JSON.stringify(res, null, 2)}\n\`\`\``
    }
  } catch (e) {
    formatMessage = `\`\`\`json\n${message}\n\`\`\``
  }

  const { InfoIcon, InfoTitle } = getInfoByStatus(messageStatus)

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle(messageStatus)}
        onClick={() => setShowMessage(!showMessage)}
      >
        {InfoIcon}
        {InfoTitle}
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
