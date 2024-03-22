import { FC, useContext } from "react"
import { Avatar } from "@illa-public/avatar"
import {
  IGroupMessage,
  MESSAGE_STATUS,
  SenderType,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import { isChatMessage, isRequestMessage } from "@/utils/agent/wsUtils"
import {
  PureMessage,
  SyncMessageCard,
  SyncMessageResult,
} from "../SyncMessageCard"
import {
  agentMessageContainer,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"

interface GroupAgentMessageProps {
  message: IGroupMessage
  isMobile: boolean
  isReceiving: boolean
  isLastMessage: boolean
}

export const GroupAgentMessage: FC<GroupAgentMessageProps> = (props) => {
  const { message, isMobile, isReceiving, isLastMessage } = props
  const chatContext = useContext(ChatContext)

  const senderNickname =
    message.items[0].sender.senderType === SenderType.ANONYMOUS_AGENT
      ? chatContext.inRoomUsers.find(
          (user) => user.roomRole == SenderType.ANONYMOUS_AGENT,
        )?.nickname ?? ""
      : chatContext.inRoomUsers.find(
          (user) => user.id == message.items[0].sender.senderID,
        )?.nickname ?? ""

  const senderAvatar =
    message.items[0].sender.senderType === SenderType.ANONYMOUS_AGENT
      ? chatContext.inRoomUsers.find(
          (user) => user.roomRole == SenderType.ANONYMOUS_AGENT,
        )?.avatar ?? ""
      : chatContext.inRoomUsers.find(
          (user) => user.id == message.items[0].sender.senderID,
        )?.avatar ?? ""

  return (
    <div css={agentMessageContainer}>
      {!isMobile && (
        <Avatar
          size={32}
          css={senderAvatarStyle}
          avatarUrl={senderAvatar}
          name={senderNickname}
          id={message.items[0].sender.senderID}
        />
      )}
      <div css={senderContainerStyle}>
        <div css={senderNicknameStyle}>{senderNickname}</div>
        {message.items.map((messageItem, i) => {
          if (isChatMessage(messageItem)) {
            return (
              <PureMessage
                key={`${messageItem.messageType}${i}`}
                message={messageItem.message}
                disableTrigger={isLastMessage && !isReceiving}
              />
            )
          } else if (isRequestMessage(messageItem)) {
            return (
              <SyncMessageCard
                key={`${messageItem.messageType}${i}`}
                message={messageItem.message}
                messageStatus={
                  messageItem.status ?? MESSAGE_STATUS.ANALYZE_PENDING
                }
              />
            )
          } else {
            return (
              <SyncMessageResult
                key={`${messageItem.messageType}${i}`}
                message={messageItem.message}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

export default GroupAgentMessage
GroupAgentMessage.displayName = "GroupAgentMessage"
