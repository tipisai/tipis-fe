import { Avatar } from "antd"
import { FC, Fragment, ReactNode } from "react"
import { getColorByString } from "@illa-public/utils"
import { MESSAGE_TYPE } from "@/components/ChatDashBoard/interface"
import MessageDivide from "./MessageDivide"
import { PureMessage } from "./PureMessage"
import ToolMessage from "./ToolMessage"
import { IAIMessageProps } from "./interface"
import {
  agentMessageContainer,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"
import { TEMP_AI_DETAIL } from "./temp"

export const AIMessage: FC<IAIMessageProps> = ({ message, isMobile }) => {
  const getRenderMessage = (type: MESSAGE_TYPE) => {
    switch (type) {
      case MESSAGE_TYPE.TOOL_USE:
        return ToolMessage
      default:
      case MESSAGE_TYPE.TEXT:
      case MESSAGE_TYPE.MARKDOWN:
        return PureMessage
    }
  }
  return (
    <div css={agentMessageContainer}>
      {!isMobile && (
        <Avatar
          shape="circle"
          size={32}
          css={senderAvatarStyle}
          style={{
            fontSize: 16,
            background: TEMP_AI_DETAIL?.iconURL
              ? "#ffffff"
              : getColorByString(TEMP_AI_DETAIL?.id || "A"),
          }}
        >
          {TEMP_AI_DETAIL?.name[0]
            ? TEMP_AI_DETAIL.name[0].toLocaleUpperCase()
            : "A"}
        </Avatar>
      )}
      <div css={senderContainerStyle}>
        <div css={senderNicknameStyle}>{TEMP_AI_DETAIL.name}</div>
        {message.map((messageItem, i) => {
          let element: ReactNode
          const RenderMessage = getRenderMessage(messageItem.message_type)
          element = <RenderMessage {...(messageItem as any)} />
          return (
            <Fragment key={`${messageItem.message_type}${i}`}>
              {element} {i !== message.length - 1 && <MessageDivide />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default AIMessage
AIMessage.displayName = "AIMessage"
