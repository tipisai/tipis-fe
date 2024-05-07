import { UIEventHandler } from "react"
import { ChatMessage, IGroupMessage } from "../interface"

export interface IMessageListProps {
  handleScroll: UIEventHandler<HTMLDivElement>
  chatMessages: (IGroupMessage | ChatMessage)[]
  isReceiving: boolean
  currentUserID: string
  currentRenderMessage: IGroupMessage | ChatMessage | null
}
