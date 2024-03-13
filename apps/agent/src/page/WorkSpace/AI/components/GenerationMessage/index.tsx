import Icon from "@ant-design/icons"
import { App } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import { ChatContext } from "@/page/WorkSpace/AI/components/ChatContext"
import { GenerationMessageProps } from "@/page/WorkSpace/AI/components/GenerationMessage/interface"
import {
  avatarContainerStyle,
  avatarStyle,
  copyContainerStyle,
  generationContainerStyle,
  nickNameStyle,
} from "@/page/WorkSpace/AI/components/GenerationMessage/style"
import MarkdownMessage from "@/page/WorkSpace/AI/components/MarkdownMessage"
import { SenderType } from "@/page/WorkSpace/AI/components/PreviewChat/interface"

export const GenerationMessage: FC<GenerationMessageProps> = (props) => {
  const { message } = props

  const { message: m } = App.useApp()
  const { t } = useTranslation()

  const chatContext = useContext(ChatContext)
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

  return (
    <div css={generationContainerStyle}>
      <div css={avatarContainerStyle}>
        <Avatar
          css={avatarStyle}
          avatarUrl={senderAvatar}
          name={senderNickname}
        />
      </div>
      <div css={nickNameStyle}>{senderNickname}</div>
      <MarkdownMessage>{message.message}</MarkdownMessage>
      <div
        css={copyContainerStyle}
        onClick={() => {
          copyToClipboard(message.message)
          m.success({
            content: t("copied"),
          })
        }}
      >
        <Icon component={CopyIcon} size={16} />
      </div>
    </div>
  )
}
