import { MutableRefObject, ReactNode } from "react"
import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  Params,
} from "@illa-public/public-types"
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
import { IAgentForm } from "../../AIAgent/interface"

export interface IAgentWSProviderProps {
  children: ReactNode
  tabID: string
}

export interface IAgentWSInject
  extends Omit<
    TipisWebSocketContextType,
    "connect" | "reconnect" | "sendMessage" | "cleanMessage"
  > {
  lastRunAgent: MutableRefObject<IAgentForm | undefined>
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  chatMessages: (IGroupMessage | ChatMessage)[]
  connect: () => Promise<void>
  reconnect: () => Promise<void>
  sendMessage: IChatSendMessage
  tabID: string
}

export interface ICachePayloadQueue {
  payload: ChatSendRequestPayload
  signal: TextSignal
  type: SEND_MESSAGE_WS_TYPE
}
export interface IRunAgentConfig {
  variables: Params[]
  model: AI_AGENT_MODEL
  prompt: string
  agentType: AI_AGENT_TYPE
}
