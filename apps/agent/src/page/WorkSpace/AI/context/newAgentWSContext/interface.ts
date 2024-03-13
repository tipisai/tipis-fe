import { ReactNode } from "react"
import { AI_AGENT_TYPE, Agent } from "@illa-public/public-types"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import {
  ChatMessage,
  ChatSendRequestPayload,
  CollaboratorsInfo,
} from "../../components/PreviewChat/interface"

export type AgentMessageType = "chat" | "stop_all" | "clean"

export type TipisWebSocketContextType = {
  connect: (agentInfo: Agent, initWSCallback: IInitWSCallback) => Promise<void>
  reconnect: (
    agentInfo: Agent,
    initWSCallback: IInitWSCallback,
  ) => Promise<void>
  sendMessage: (
    payload: ChatSendRequestPayload,
    signal: TextSignal,
    aiAgentType: AI_AGENT_TYPE,
    type: AgentMessageType,
    updateMessage?: boolean,
    messageContent?: ChatMessage,
  ) => void
  generationMessage: ChatMessage | undefined
  leaveRoom: () => void
  chatMessages: ChatMessage[]
  wsStatus: ILLA_WEBSOCKET_STATUS
}

export interface TipisWebSocketProviderProps {
  children: ReactNode
}

export interface IInitWSCallback {
  onReceiving: (isReceiving: boolean) => void
  onUpdateRoomUsers: (roomUsers: CollaboratorsInfo[]) => void
  onStartRunning: () => void
  onRunning: (isRunning: boolean) => void
  onConnecting: (isConnecting: boolean) => void
}
