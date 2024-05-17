import { FC } from "react"
import GroupAgentMessage from "@/components/_PreviewChatCache/components/GroupAgentMessage"
import UserMessage from "@/components/_PreviewChatCache/components/UserMessage"
import { isGroupMessage } from "@/utils/agent/typeHelper"
import { SenderType } from "../../../interface"
import AIAgentMessage from "../../AIAgentMessage"
import { IMessageListItemProps } from "./interface"

const MessageListItem: FC<IMessageListItemProps> = ({
  message,
  currentUserID,
  isReceiving,
  isLastMessage,
}) => {
  if (isGroupMessage(message)) {
    return (
      <GroupAgentMessage
        key={message.threadID}
        message={message}
        disableTrigger={isReceiving && isLastMessage}
      />
    )
  } else if (
    message.sender.senderType === SenderType.USER &&
    message.sender.senderID === currentUserID
  ) {
    return (
      <UserMessage
        key={message.threadID}
        message={message}
        disableTrigger={isReceiving && isLastMessage}
      />
    )
  } else {
    return (
      <AIAgentMessage
        key={message.threadID}
        message={message}
        isLastMessage={isLastMessage}
        isReceiving={isReceiving}
      />
    )
  }
}

export default MessageListItem
