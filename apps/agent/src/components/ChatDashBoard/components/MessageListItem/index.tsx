import { FC } from "react"
import AIMessage from "../AIMessage"
import HumanMessage from "../HumanMessage"
import { IMessageListItemProps } from "./interface"

const MessageListItem: FC<IMessageListItemProps> = ({ messageCycle }) => {
  const { humanMessage, aiMessage } = messageCycle
  return (
    <>
      <HumanMessage message={humanMessage} />
      {Array.isArray(aiMessage) && aiMessage.length > 0 && (
        <AIMessage message={aiMessage} />
      )}
    </>
  )
}

export default MessageListItem
