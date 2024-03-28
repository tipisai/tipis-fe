import { MutableRefObject, ReactNode } from "react"
import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  Params,
} from "@illa-public/public-types"
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
  lastRunAgent: MutableRefObject<IRunAgentConfig | undefined>
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

export interface IRunAgentConfig {
  variables: Params[]
  model: AI_AGENT_MODEL
  prompt: string
  agentType: AI_AGENT_TYPE
}
