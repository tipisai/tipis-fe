import { ChatMessage } from "@/components/PreviewChat/interface"

export interface AIAgentMessageProps {
  message: ChatMessage
  isReceiving: boolean
  isLastMessage: boolean
}
