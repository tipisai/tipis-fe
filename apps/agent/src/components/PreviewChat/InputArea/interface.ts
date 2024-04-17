import { ChatMessage } from "../interface"

export interface IInputAreaProps {
  isReceiving: boolean
  onSendMessage: (message: ChatMessage) => void
  hasMessage: boolean
}
