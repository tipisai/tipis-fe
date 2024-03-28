import { ReactNode } from "react"
import { Agent } from "@illa-public/public-types"
import { TextSignal } from "@/api/ws/textSignal"
import {
  IChatSendMessage,
  SEND_MESSAGE_WS_TYPE,
  TipisWebSocketContextType,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
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

export interface ICachePayloadQueue {
  payload: ChatSendRequestPayload
  signal: TextSignal
  type: SEND_MESSAGE_WS_TYPE
}
