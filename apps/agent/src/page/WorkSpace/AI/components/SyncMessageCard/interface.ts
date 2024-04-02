import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"

export interface SyncMessageCardProps {
  message: string
  messageStatus: MESSAGE_STATUS
  disableTrigger: boolean
}

export interface PureMessageProps {
  disableTrigger: boolean
  message: string
}

export interface SyncMessageResultProps {
  message: string
}
