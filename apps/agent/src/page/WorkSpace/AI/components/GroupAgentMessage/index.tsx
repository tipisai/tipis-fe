import { FC, Fragment, ReactNode, useContext } from "react"
import { Avatar } from "@illa-public/avatar"
import {
  IGroupMessage,
  MESSAGE_STATUS,
  SenderType,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import { isErrorMessageRes, isRequestMessage } from "@/utils/agent/wsUtils"
import {
  PureMessage,
  SyncMessageCard,
  SyncMessageLine,
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

  const uiMessage = message.items.filter((item) => item.message)

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
        {uiMessage.map((messageItem, i) => {
          if (!messageItem.message) {
            return null
          }
          let element: ReactNode
          if (isRequestMessage(messageItem)) {
            element = (
              <SyncMessageCard
                message={messageItem.message}
                messageStatus={
                  messageItem.status ?? MESSAGE_STATUS.ANALYZE_PENDING
                }
                disableTrigger={isMobile || isReceiving}
              />
            )
          } else if (isErrorMessageRes(messageItem)) {
            element = (
              <SyncMessageResult
                disableTrigger={isMobile || isReceiving}
                message={messageItem.message}
              />
            )
          } else {
            element = (
              <PureMessage
                message={messageItem.message}
                disableTrigger={
                  (isLastMessage && !isReceiving) || isMobile || isReceiving
                }
              />
            )
          }
          return (
            <Fragment key={`${messageItem.messageType}${i}`}>
              {element} {i !== uiMessage.length - 1 && <SyncMessageLine />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default GroupAgentMessage
GroupAgentMessage.displayName = "GroupAgentMessage"
