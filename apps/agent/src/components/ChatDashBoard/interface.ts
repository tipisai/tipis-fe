// common
export enum MESSAGE_STATUS {
  ANALYZE_SUCCESS = "analyze_success",
  ANALYZE_FAILED = "analyze_failed",
  ANALYZE_PENDING = "analyze_pending",
  ANALYZE_STOP = "analyze_stop",
}

export enum READYSTATE {
  INITIALIZING = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2,
}

export enum MESSAGE_ROLE_TYPE {
  AI = "ai",
  HUMAN = "human",
  FUNCTION = "function",
  KNOWLEDGE_UPDATE = "knowledge_update",
}

export enum MESSAGE_TYPE {
  TEXT = "text",
  TOOL_USE = "tool_use",
  MARKDOWN = "markdown",
}

export interface IFunctionMessageContent {
  type: MESSAGE_TYPE.TEXT | MESSAGE_TYPE.MARKDOWN
  content: string
}

export interface IToolUseMessageContent {
  input: {
    code: string
  }
  type: MESSAGE_TYPE.TOOL_USE
  id: string
  name: string
}

// VO
export interface IMessageFileVO {
  file_id: string
  file_name: string
  content_type: string
  download_url?: string
}

export interface IHumanMessageVO {
  type: MESSAGE_ROLE_TYPE.HUMAN
  message_id: string
  content: string
  file_list?: IMessageFileVO[]
}

export interface IAIMessageVO {
  type: MESSAGE_ROLE_TYPE.AI | MESSAGE_ROLE_TYPE.FUNCTION
  function_name: string
  message_type: MESSAGE_TYPE
  message_id: string
  content: string
  status?: MESSAGE_STATUS
  message_result?: string
}

export interface IMessageCycleVO {
  humanMessage: IHumanMessageVO
  aiMessage: IAIMessageVO[]
}

// DTO
export interface IAIMessageDTO {
  type: MESSAGE_ROLE_TYPE.AI
  message_type: MESSAGE_TYPE
  message_id: string
  content: string | IToolUseMessageContent
}

export interface IHumanMessageDTO {
  type: MESSAGE_ROLE_TYPE.HUMAN
  human_message: string
  human_message_id: string
  agent_id: string
  file_list: string[]
  chat_history: IMessageHistoryDTO[]
}

export interface IFunctionMessageDTO {
  type: MESSAGE_ROLE_TYPE.FUNCTION
  error: boolean
  message_type: MESSAGE_TYPE.MARKDOWN
  message_id: string
  content: IFunctionMessageContent
  function_name: string
}

export interface IUpdateKnowledgeDTO {
  type: MESSAGE_ROLE_TYPE.KNOWLEDGE_UPDATE
  updated_message_id: string
  message_id: string
}

export type IReceiveMessageDTO =
  | IHumanMessageDTO
  | IAIMessageDTO
  | IFunctionMessageDTO
  | IUpdateKnowledgeDTO

export type IMessageHistoryDTO =
  | IHumanMessageDTO
  | IAIMessageDTO
  | IFunctionMessageDTO

export interface IPreviewChatProps {}
