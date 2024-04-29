import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"

export interface SyncMessageCardProps {
  isReceiving: boolean
  message: string
  messageStatus: MESSAGE_STATUS
  messageResult?: string
}

export interface PureMessageProps {
  message: string
  isMobile: boolean
  disableTrigger: boolean
}

export interface IMessageCardShowInfo {
  InfoIcon: React.ReactNode
  InfoTitle: string
  infoDesc: string
}
