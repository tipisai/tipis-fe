import { ChatMessage } from "@/components/_PreviewChatCache/interface"

export interface AIAgentMessageProps {
  message: ChatMessage
  isReceiving: boolean
  isLastMessage: boolean
}
