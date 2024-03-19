import Icon from "@ant-design/icons"
import { App } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import { SenderType } from "@/components/PreviewChat/interface"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import MarkdownMessage from "../MarkdownMessage"
import { AIAgentMessageProps } from "./interface"
import {
  agentMessageContainer,
  hoverCopyStyle,
  messageContainerStyle,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"

export const AIAgentMessage: FC<AIAgentMessageProps> = (props) => {
  const { message, isMobile, isReceiving, isLastMessage } = props
  const chatContext = useContext(ChatContext)
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()

  const senderNickname =
    message.sender.senderType === SenderType.ANONYMOUS_AGENT
      ? chatContext.inRoomUsers.find(
          (user) => user.roomRole == SenderType.ANONYMOUS_AGENT,
        )?.nickname ?? ""
      : chatContext.inRoomUsers.find(
          (user) => user.id == message.sender.senderID,
        )?.nickname ?? ""

  const senderAvatar =
    message.sender.senderType === SenderType.ANONYMOUS_AGENT
      ? chatContext.inRoomUsers.find(
          (user) => user.roomRole == SenderType.ANONYMOUS_AGENT,
        )?.avatar ?? ""
      : chatContext.inRoomUsers.find(
          (user) => user.id == message.sender.senderID,
        )?.avatar ?? ""

  return (
    <div css={agentMessageContainer}>
      {!isMobile && (
        <Avatar
          size={32}
          css={senderAvatarStyle}
          avatarUrl={senderAvatar}
          name={senderNickname}
          id={message.sender.senderID}
        />
      )}
      <div css={senderContainerStyle}>
        {isLastMessage && !isReceiving && message.message && (
          <span
            css={hoverCopyStyle}
            onClick={() => {
              copyToClipboard(message.message ?? "")
              messageAPI.success({
                content: t("copied"),
              })
            }}
          >
            <Icon component={CopyIcon} size={14} />
          </span>
        )}
        <div css={senderNicknameStyle}>{senderNickname}</div>
        <div css={messageContainerStyle}>
          <MarkdownMessage disableTrigger={isLastMessage && !isReceiving}>
            {message.message}
          </MarkdownMessage>
        </div>
      </div>
    </div>
  )
}

export default AIAgentMessage
AIAgentMessage.displayName = "AIAgentMessage"
