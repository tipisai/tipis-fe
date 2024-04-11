import { ChatMessage } from "@/components/PreviewChat/interface"

export interface UserMessageProps {
  message: ChatMessage
  isMobile: boolean
  isReceiving: boolean
}
