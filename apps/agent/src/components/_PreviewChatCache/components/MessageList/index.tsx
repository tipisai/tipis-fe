import { forwardRef } from "react"
import MessageItem from "./MessageListItem"
import { IMessageListProps } from "./interface"
import { chatContainerStyle, maxWidthStyle } from "./style"

const MessageList = forwardRef<HTMLDivElement, IMessageListProps>(
  (props, ref) => {
    const {
      handleScroll,
      chatMessages,
      isReceiving,
      currentUserID,
      currentRenderMessage,
    } = props
    return (
      <div ref={ref} css={chatContainerStyle} onScroll={handleScroll}>
        <div css={maxWidthStyle}>
          {chatMessages.map((message, i) => (
            <MessageItem
              key={message.threadID}
              message={message}
              currentUserID={currentUserID}
              isLastMessage={i === chatMessages.length - 1}
              isReceiving={isReceiving}
            />
          ))}

          {!!currentRenderMessage && (
            <MessageItem
              key={currentRenderMessage.threadID}
              message={currentRenderMessage}
              currentUserID={currentUserID}
              isLastMessage
              isReceiving={isReceiving}
            />
          )}
        </div>
      </div>
    )
  },
)

MessageList.displayName = "MessageList"

export default MessageList
