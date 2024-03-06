import { AI_AGENT_TYPE } from "@illa-public/public-types"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import {
  ChatMessage,
  ChatSendRequestPayload,
  CollaboratorsInfo,
} from "@/page/AI/components/PreviewChat/interface"
import { AgentMessageType } from "@/page/AI/components/ws/useAgentConnect"

export interface UseAgentProps {
  onConnecting: (isConnecting: boolean) => void
  onRunning: (isRunning: boolean) => void
  onReceiving: (isReceiving: boolean) => void
  onUpdateRoomUsers: (roomUsers: CollaboratorsInfo[]) => void
  onSendPrompt: () => void
  onStartRunning: () => void
  onSendClean: () => void
}

export interface UseAgentReturn {
  connect: (aiAgentID: string, agentType: AI_AGENT_TYPE) => Promise<void>
  reconnect: (aiAgentID: string, agentType: AI_AGENT_TYPE) => Promise<void>
  sendMessage: (
    payload: ChatSendRequestPayload,
    signal: TextSignal,
    aiAgentType: AI_AGENT_TYPE,
    type: AgentMessageType,
    updateMessage?: boolean,
    messageContent?: ChatMessage,
  ) => void
  generationMessage: ChatMessage | undefined
  chatMessages: ChatMessage[]
  wsStatus: ILLA_WEBSOCKET_STATUS
}
