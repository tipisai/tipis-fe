import { ChatMessage } from "@/page/WorkSpace/AI/components/PreviewChat/interface"

export interface AIAgentMessageProps {
  message: ChatMessage
  isMobile: boolean
  canShowLongCopy: boolean
}
