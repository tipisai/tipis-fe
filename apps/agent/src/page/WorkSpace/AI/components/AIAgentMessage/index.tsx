import { FC, useContext } from "react"
import { Avatar } from "@illa-public/avatar"
import {
  MESSAGE_SYNC_TYPE,
  SenderType,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import {
  PureMessage,
  SyncMessageCard,
  SyncMessageResult,
} from "../SyncMessageCard"
import { AIAgentMessageProps } from "./interface"
import {
  agentMessageContainer,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"

export const AIAgentMessage: FC<AIAgentMessageProps> = (props) => {
  const { message, isMobile, isReceiving, isLastMessage } = props
  const chatContext = useContext(ChatContext)

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

  const isResult =
    message.messageType ===
      MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR ||
    message.messageType ===
      MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK

  const isChat =
    message.messageType === MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_CHAT ||
    !message.messageType

  const isCode =
    message.messageType === MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST

  return (
    <div css={agentMessageContainer(isResult)}>
      {!isMobile && (
        <Avatar
          size={32}
          css={senderAvatarStyle(!isResult)}
          avatarUrl={senderAvatar}
          name={senderNickname}
          id={message.sender.senderID}
        />
      )}
      <div css={senderContainerStyle}>
        {!isResult && <div css={senderNicknameStyle}>{senderNickname}</div>}
        {isChat && (
          <PureMessage
            disableTrigger={!isReceiving && isLastMessage}
            message={message.message}
          />
        )}
        {isResult && (
          <SyncMessageResult
            message={message.message}
            syncType={message.messageType}
            disableTrigger={!isReceiving && isLastMessage}
          />
        )}
        {isCode && (
          <SyncMessageCard
            message={message.message}
            syncType={message.messageType}
            isReceiving={isReceiving}
            isLastMessage={isLastMessage}
          />
        )}
      </div>
    </div>
  )
}

export default AIAgentMessage
AIAgentMessage.displayName = "AIAgentMessage"
