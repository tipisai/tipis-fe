import Icon from "@ant-design/icons"
import { App, Avatar, Tooltip } from "antd"
import { FC, useRef } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon } from "@illa-public/icon"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { copyToClipboard, getColorByString } from "@illa-public/utils"
import MarkdownMessage from "../MarkdownMessage"
import { IHumanMessageProps } from "./interface"
import {
  markdownHoverCopyStyle,
  messageContainer,
  messageContainerStyle,
  senderAvatarStyle,
  senderContainerStyle,
  senderNicknameStyle,
} from "./style"

const HumanMessage: FC<IHumanMessageProps> = ({ message, isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()

  const contentBody = (
    <div css={messageContainerStyle} ref={containerRef}>
      <MarkdownMessage isOwnMessage>{message.content}</MarkdownMessage>
    </div>
  )

  return (
    <div css={messageContainer}>
      <div css={senderContainerStyle}>
        <span css={senderNicknameStyle}>{currentUserInfo?.nickname}</span>
        {/* {Array.isArray(message.file_list) && message.file_list.length > 0 && (
          <ShowFiles fileList={message.file_list} />
        )} */}
        {message.content &&
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
                    copyToClipboard(message.content ?? "")
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
          shape="circle"
          size={32}
          css={senderAvatarStyle}
          style={{
            fontSize: 16,
            background: currentUserInfo?.avatarUrl
              ? "#ffffff"
              : getColorByString(currentUserInfo?.id || "U"),
          }}
        >
          {currentUserInfo?.nickname[0]
            ? currentUserInfo.nickname[0].toLocaleUpperCase()
            : "U"}
        </Avatar>
      )}
    </div>
  )
}

export default HumanMessage
