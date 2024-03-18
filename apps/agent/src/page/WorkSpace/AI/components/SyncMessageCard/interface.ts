import { MESSAGE_SYNC_TYPE } from "@/components/PreviewChat/interface"

export interface SyncMessageCardProps {
  syncType?: MESSAGE_SYNC_TYPE
  message: string
  isReceiving: boolean
  isLastMessage: boolean
}

export interface PureMessageProps {
  disableTrigger: boolean
  message: string
}

export interface SyncMessageResultProps {
  disableTrigger: boolean
  message: string
  syncType: MESSAGE_SYNC_TYPE
}
