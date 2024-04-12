import Icon from "@ant-design/icons"
import { App, Tooltip } from "antd"
import { FC, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { CopyIcon } from "@illa-public/icon"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { copyToClipboard } from "@illa-public/utils"
import MarkdownMessage from "@/page/WorkSpace/AI/components/MarkdownMessage"
import { UserMessageProps } from "@/page/WorkSpace/AI/components/UserMessage/interface"
import {
  agentMessageContainer,
  markdownHoverCopyStyle,
  messageContainerStyle,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "@/page/WorkSpace/AI/components/UserMessage/style"
import ShowFiles from "./ShowFiles"

export const UserMessage: FC<UserMessageProps> = (props) => {
  const { message, isMobile, isReceiving } = props
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()

  const contentBody = (
    <div css={messageContainerStyle} ref={containerRef}>
      <MarkdownMessage isOwnMessage isReceiving={isReceiving}>
        {message.message}
      </MarkdownMessage>
    </div>
  )

  return (
    <div css={agentMessageContainer}>
      <div css={senderContainerStyle}>
        <span css={senderNicknameStyle}>{currentUserInfo?.nickname}</span>
        {Array.isArray(message.knowledgeFiles) &&
          message.knowledgeFiles.length > 0 && (
            <ShowFiles knowledgeFiles={message.knowledgeFiles} />
          )}
        {message.message &&
          (isMobile ? (
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
              placement="leftBottom"
              showArrow={false}
              autoAdjustOverflow={false}
              trigger="hover"
              getTooltipContainer={() => containerRef.current!}
            >
              {contentBody}
            </Tooltip>
          ))}
      </div>
      {!isMobile && (
        <Avatar
          size={32}
          css={senderAvatarStyle}
          avatarUrl={currentUserInfo?.avatar}
          name={currentUserInfo?.nickname}
          id={currentUserInfo?.userID}
        />
      )}
    </div>
  )
}

export default UserMessage
UserMessage.displayName = "UserMessage"
