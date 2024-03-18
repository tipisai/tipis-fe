import Icon from "@ant-design/icons"
import { App } from "antd"
import { AnimatePresence } from "framer-motion"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon, DownIcon, UpIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import AnalyzeIcon from "@/assets/agent/message-analyze.svg?react"
import { MESSAGE_SYNC_TYPE } from "@/components/PreviewChat/interface"
import MarkdownMessage from "../MarkdownMessage"
import {
  PureMessageProps,
  SyncMessageCardProps,
  SyncMessageResultProps,
} from "./interface"
import {
  containerStyle,
  headerContainerStyle,
  hoverCopyStyle,
  infoIconStyle,
  messageContainerStyle,
} from "./style"

export const PureMessage: FC<PureMessageProps> = ({
  disableTrigger,
  message,
}) => {
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  return (
    <div css={messageContainerStyle}>
      <MarkdownMessage disableTrigger={disableTrigger}>
        {message}
      </MarkdownMessage>
      {disableTrigger && message && (
        <span
          css={hoverCopyStyle}
          onClick={() => {
            copyToClipboard(message ?? "")
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} size={14} />
        </span>
      )}
    </div>
  )
}

export const SyncMessageResult: FC<SyncMessageResultProps> = ({
  disableTrigger,
  message,
  syncType,
}) => {
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  return (
    <div css={messageContainerStyle}>
      {syncType ===
      MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR ? (
        <span>error</span>
      ) : (
        <span>success</span>
      )}
      <MarkdownMessage disableTrigger={disableTrigger}>
        {message}
      </MarkdownMessage>
      {disableTrigger && message && (
        <span
          css={hoverCopyStyle}
          onClick={() => {
            copyToClipboard(message ?? "")
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} size={14} />
        </span>
      )}
    </div>
  )
}

export const SyncMessageCard: FC<SyncMessageCardProps> = ({
  message,
  isReceiving,
  isLastMessage,
}) => {
  const isMessageReceiving = isReceiving && isLastMessage
  const { t } = useTranslation()
  const [showMessage, setShowMessage] = useState(false)

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle(isMessageReceiving)}
        onClick={() => setShowMessage(!showMessage)}
      >
        <Icon component={AnalyzeIcon} css={infoIconStyle} />
        {isReceiving ? t("analyzing") : t("analyze end")}
        {!isMessageReceiving && (
          <Icon component={showMessage ? UpIcon : DownIcon} />
        )}
      </div>
      <AnimatePresence>
        {showMessage && (
          <div css={messageContainerStyle}>
            <MarkdownMessage disableTrigger={isLastMessage && !isReceiving}>
              {message}
            </MarkdownMessage>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
