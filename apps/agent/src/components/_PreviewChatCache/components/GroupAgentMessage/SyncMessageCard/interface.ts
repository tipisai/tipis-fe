import { MESSAGE_STATUS } from "@/components/_PreviewChatCache/interface"

export interface SyncMessageCardProps {
  disableTrigger: boolean
  message: string
  messageStatus: MESSAGE_STATUS
  messageResult?: string
}

export interface PureMessageProps {
  message: string
  isMobile: boolean
}
