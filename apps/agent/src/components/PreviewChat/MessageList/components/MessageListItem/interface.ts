import { ChatMessage, IGroupMessage } from "../../../interface"

export interface IMessageListItemProps {
  message: IGroupMessage | ChatMessage
  isReceiving: boolean
  isLastMessage: boolean
  currentUserID: string
}
