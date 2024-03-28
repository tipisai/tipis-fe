import { ReactNode } from "react"
import { Agent } from "@illa-public/public-types"
import {
  IChatSendMessage,
  TipisWebSocketContextType,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  CollaboratorsInfo,
  IGroupMessage,
} from "@/components/PreviewChat/interface"

export interface IAgentWSProviderProps {
  children: ReactNode
}

export interface IAgentWSInject
  extends Omit<
    TipisWebSocketContextType,
    "connect" | "reconnect" | "sendMessage"
  > {
  lastRunAgent: Agent | undefined
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  chatMessages: (IGroupMessage | ChatMessage)[]
  setIsReceiving: (isReceiving: boolean) => void
  connect: () => Promise<void>
  reconnect: () => Promise<void>
  sendMessage: IChatSendMessage
}
