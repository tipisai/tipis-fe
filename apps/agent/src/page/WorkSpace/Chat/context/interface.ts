import { ReactNode } from "react"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
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
  getReadyState: () => WS_READYSTATE
}

export interface ICachePayloadQueue {
  payload: ChatSendRequestPayload
  signal: TextSignal
  type: SEND_MESSAGE_WS_TYPE
}
