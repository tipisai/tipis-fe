import { forwardRef } from "react"
import MessageItem from "../MessageListItem"
import { IMessageListProps } from "./interface"
import { chatContainerStyle, maxWidthStyle } from "./style"

const MessageList = forwardRef<HTMLDivElement, IMessageListProps>(
  (props, ref) => {
    const { handleScroll, cycleMessageList, currentRenderCycle } = props
    return (
      <div ref={ref} css={chatContainerStyle} onScroll={handleScroll}>
        <div css={maxWidthStyle}>
          {cycleMessageList.map((message, i) => (
            <MessageItem key={i} messageCycle={message} />
          ))}
          {!!currentRenderCycle && (
            <MessageItem messageCycle={currentRenderCycle} />
          )}
        </div>
      </div>
    )
  },
)

MessageList.displayName = "MessageList"

export default MessageList
