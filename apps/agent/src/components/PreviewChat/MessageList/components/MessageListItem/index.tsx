import { FC } from "react"
import AIAgentMessage from "@/page/WorkSpace/AI/components/AIAgentMessage"
import GroupAgentMessage from "@/page/WorkSpace/AI/components/GroupAgentMessage"
import UserMessage from "@/page/WorkSpace/AI/components/UserMessage"
import { isGroupMessage } from "@/utils/agent/typeHelper"
import { SenderType } from "../../../interface"
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
