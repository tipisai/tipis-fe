import { ReactNode } from "react"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
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
  sendMessage: IChatSendMessage
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

export interface ICachePayloadQueue {
  payload: ChatSendRequestPayload
  signal: TextSignal
  type: SEND_MESSAGE_WS_TYPE
}
