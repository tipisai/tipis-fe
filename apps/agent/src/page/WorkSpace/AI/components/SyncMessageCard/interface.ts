import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"

export interface SyncMessageCardProps {
  isReceiving: boolean
  message: string
  messageStatus: MESSAGE_STATUS
  messageResult?: string
}

export interface PureMessageProps {
  disableTrigger: boolean
  message: string
  isReceiving: boolean
}

export interface SyncMessageResultProps {
  isReceiving: boolean
  message: string
  disableTrigger: boolean
}
