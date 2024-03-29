import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  AgentAdvanceConfig,
  IKnowledgeFile,
} from "@illa-public/public-types"
import { Params } from "@illa-public/record-editor"
import { ILLA_WEBSOCKET_STATUS } from "../../api/ws/interface"
import { TextSignal } from "../../api/ws/textSignal"
import { AgentMessageType } from "./TipisWebscoketContext/interface"

export type EDIT_STATE = "EDIT" | "RUN"

export enum SenderType {
  USER = 1,
  AGENT = 2,
  ANONYMOUS_AGENT = 3,
}

export enum MESSAGE_SYNC_TYPE {
  GPT_CHAT_MESSAGE_TYPE_CHAT = 1,
  GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST = 2,
  GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK = 3,
  GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR = 4,
}

export interface CollaboratorsInfo {
  id: string
  nickname: string
  avatar: string
  roomRole: SenderType
}

export interface ChatWsAppendResponse {
  sender: ChatSender
  threadID: string
  message: string
  actionID: string
  messageType: MESSAGE_SYNC_TYPE
}

export interface ChatWsEndResponse {
  actionID: string
}

export interface ChatSender {
  senderID: string
  senderType: SenderType
}

export interface ChatMessage {
  threadID: string
  message: string
  sender: ChatSender
  messageType: MESSAGE_SYNC_TYPE
  knowledgeFiles?: IKnowledgeFile[]
}

export interface ChatSendRequestPayload {
  threadID: string
  prompt: string
  actionID: string // the ID of who answered the question
  variables: Params[]
  model: AI_AGENT_MODEL
  agentType: AI_AGENT_TYPE
  modelConfig: AgentAdvanceConfig
}

export interface PreviewChatProps {
  model: AI_AGENT_MODEL
  editState: EDIT_STATE
  blockInput: boolean
  isMobile: boolean
  onSendMessage: (cheatMessage: ChatMessage) => void
  wsContextValue: {
    wsStatus: ILLA_WEBSOCKET_STATUS
    isRunning: boolean
    chatMessages: ChatMessage[]
    isReceiving: boolean
    sendMessage: (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      type: AgentMessageType,
      updateMessage?: boolean,
      messageContent?: ChatMessage,
    ) => void
    setIsReceiving: (isReceiving: boolean) => void
  }
}
