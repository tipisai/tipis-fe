import { MutableRefObject, ReactNode } from "react"
import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  Params,
} from "@illa-public/public-types"
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

export interface IAgentWSProviderProps {
  children: ReactNode
}

export interface IAgentWSInject
  extends Omit<
    TipisWebSocketContextType,
    "connect" | "reconnect" | "sendMessage"
  > {
  lastRunAgent: MutableRefObject<IRunAgentConfig | undefined>
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  chatMessages: (IGroupMessage | ChatMessage)[]
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

export interface IRunAgentConfig {
  variables: Params[]
  model: AI_AGENT_MODEL
  prompt: string
  agentType: AI_AGENT_TYPE
}
