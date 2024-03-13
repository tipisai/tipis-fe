import { createContext } from "react"
import { ChatContextProps } from "@/page/WorkSpace/AI/components/ChatContext/interface"

export const ChatContext = createContext<ChatContextProps>({
  inRoomUsers: [],
})

ChatContext.displayName = "ChatContext"
