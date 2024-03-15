import { ChatMessage } from "@/components/PreviewChat/interface"

export interface AIAgentMessageProps {
  message: ChatMessage
  isMobile: boolean
  canShowLongCopy: boolean
}
