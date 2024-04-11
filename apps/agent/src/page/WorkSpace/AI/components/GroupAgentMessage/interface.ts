import { IGroupMessage } from "@/components/PreviewChat/interface"

export interface GroupAgentMessageProps {
  message: IGroupMessage
  isMobile: boolean
  isReceiving: boolean
  isLastMessage: boolean
}
