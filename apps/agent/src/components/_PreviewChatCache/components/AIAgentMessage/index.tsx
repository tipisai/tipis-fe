import Icon from "@ant-design/icons"
import { App, Tooltip } from "antd"
import { FC, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { CopyIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { copyToClipboard, useIsMobile } from "@illa-public/utils"
import { SenderType } from "@/components/_PreviewChatCache/interface"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import MarkdownMessage from "../MarkdownMessage"
import { AIAgentMessageProps } from "./interface"
import {
  agentMessageContainer,
  hoverCopyStyle,
  markdownHoverCopyStyle,
  messageContainerStyle,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"

export const AIAgentMessage: FC<AIAgentMessageProps> = (props) => {
  const { message, isReceiving, isLastMessage } = props
  const chatContext = useContext(ChatContext)
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

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

  const contentBody = (
    <div css={messageContainerStyle} ref={containerRef}>
      <MarkdownMessage disableTrigger={isReceiving && isLastMessage}>
        {message.message}
      </MarkdownMessage>
    </div>
  )

  return (
    <div css={agentMessageContainer}>
      {!isMobile && (
        <Avatar
          size={32}
          css={senderAvatarStyle}
          avatarUrl={senderAvatar}
          name={senderNickname}
          id={message.sender.senderID}
        />
      )}
      <div css={senderContainerStyle}>
        {!isMobile && isLastMessage && !isReceiving && message.message && (
          <span
            css={hoverCopyStyle}
            onClick={() => {
              copyToClipboard(message.message ?? "")
              TipisTrack.track("click_copy_result")
              messageAPI.success({
                content: t("copied"),
              })
            }}
          >
            <Icon component={CopyIcon} />
          </span>
        )}
        <div css={senderNicknameStyle}>{senderNickname}</div>
        {(isLastMessage && !isReceiving) || isMobile ? (
          contentBody
        ) : (
          <Tooltip
            color="transparent"
            zIndex={0}
            overlayInnerStyle={{
              padding: 0,
              minHeight: "24px",
              minWidth: "24px",
              boxShadow: "none",
            }}
            mouseEnterDelay={0}
            mouseLeaveDelay={0.5}
            title={
              <span
                css={markdownHoverCopyStyle}
                onClick={() => {
                  copyToClipboard(message.message ?? "")
                  messageAPI.success({
                    content: t("copied"),
                  })
                }}
              >
                <Icon component={CopyIcon} />
              </span>
            }
            placement="rightBottom"
            showArrow={false}
            autoAdjustOverflow={false}
            trigger="hover"
            getTooltipContainer={() => containerRef.current!}
          >
            {contentBody}
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default AIAgentMessage
AIAgentMessage.displayName = "AIAgentMessage"
