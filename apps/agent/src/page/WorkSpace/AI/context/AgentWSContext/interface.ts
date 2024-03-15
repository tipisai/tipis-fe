import { ReactNode } from "react"
import { Agent } from "@illa-public/public-types"
import { TextSignal } from "@/api/ws/textSignal"
import {
  AgentMessageType,
  TipisWebSocketContextType,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
  CollaboratorsInfo,
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
  chatMessages: ChatMessage[]
  setIsReceiving: (isReceiving: boolean) => void
  connect: () => Promise<void>
  reconnect: () => Promise<void>
  sendMessage: (
    payload: ChatSendRequestPayload,
    signal: TextSignal,
    type: AgentMessageType,
    updateMessage?: boolean,
    messageContent?: ChatMessage,
  ) => void
}
