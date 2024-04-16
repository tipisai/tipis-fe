import { IGroupMessage } from "@/components/PreviewChat/interface"

export interface GroupAgentMessageProps {
  message: IGroupMessage
  isReceiving: boolean
  isLastMessage: boolean
}
