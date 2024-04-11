import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"

export interface SyncMessageCardProps {
  message: string
  messageStatus: MESSAGE_STATUS
  messageResult?: string
}

export interface PureMessageProps {
  disableTrigger: boolean
  message: string
}

export interface SyncMessageResultProps {
  message: string
  disableTrigger: boolean
}
