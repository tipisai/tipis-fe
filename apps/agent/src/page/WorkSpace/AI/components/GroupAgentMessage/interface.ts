import { ChatMessage } from "@/components/PreviewChat/interface"

export interface AIAgentMessageProps {
  message: ChatMessage
  isMobile: boolean
  isReceiving: boolean
  isLastMessage: boolean
}
