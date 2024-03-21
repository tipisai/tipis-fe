import { ReactNode } from "react"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import {
  AgentMessageType,
  TipisWebSocketContextType,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
  CollaboratorsInfo,
  IGroupMessage,
} from "@/components/PreviewChat/interface"

export interface IChatWSProviderProps {
  children: ReactNode
}

export interface IAgentWSInject
  extends Omit<
    TipisWebSocketContextType,
    "connect" | "reconnect" | "sendMessage"
  > {
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  chatMessages: (IGroupMessage | ChatMessage)[]
}

export interface IChatStableWSInject {
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
  leaveRoom: () => void
}

export interface IChatUnStableWSInject {
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  chatMessages: (IGroupMessage | ChatMessage)[]
  wsStatus: ILLA_WEBSOCKET_STATUS
}
