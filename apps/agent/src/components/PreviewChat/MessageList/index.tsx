import { forwardRef } from "react"
import { isGroupMessage } from "@/utils/agent/typeHelper"
import AIAgentMessage from "../../../page/WorkSpace/AI/components/AIAgentMessage"
import GroupAgentMessage from "../../../page/WorkSpace/AI/components/GroupAgentMessage"
import UserMessage from "../../../page/WorkSpace/AI/components/UserMessage"
import { SenderType } from "../interface"
import { IMessageListProps } from "./interface"
import { chatContainerStyle, maxWidthStyle } from "./style"

const MessageList = forwardRef<HTMLDivElement, IMessageListProps>(
  (props, ref) => {
    const { handleScroll, chatMessages, isReceiving, currentUserID } = props
    return (
      <div ref={ref} css={chatContainerStyle} onScroll={handleScroll}>
        <div css={maxWidthStyle}>
          {chatMessages.map((message, i) => {
            if (isGroupMessage(message)) {
              return (
                <GroupAgentMessage
                  key={message.threadID}
                  message={message}
                  isReceiving={isReceiving}
                  isLastMessage={i === chatMessages.length - 1}
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
                  isReceiving={isReceiving}
                />
              )
            } else {
              return (
                <AIAgentMessage
                  key={message.threadID}
                  message={message}
                  isLastMessage={i === chatMessages.length - 1}
                  isReceiving={isReceiving}
                />
              )
            }
          })}
        </div>

        {/* <div css={maxWidthStyle}>{messagesList}</div> */}
      </div>
    )
  },
)

MessageList.displayName = "MessageList"

export default MessageList
