import { ReactNode } from "react"
import { Callback, ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import { ChatMessage, ChatSendRequestPayload } from "../interface"

export enum SEND_MESSAGE_WS_TYPE {
  CHAT = "chat",
  STOP_ALL = "stop_all",
  CLEAN = "clean",
  ADD_FILE = "add_file",
}

export interface ISendMessageOptions {
  fileIDs?: string[]
  updateMessage?: boolean
  messageContent?: ChatMessage
}

export type IChatSendMessage = (
  payload: ChatSendRequestPayload,
  signal: TextSignal,
  type: SEND_MESSAGE_WS_TYPE,
  options?: ISendMessageOptions,
) => void

export type TipisWebSocketContextType = {
  connect: (initWSCallback: IInitWSCallback) => Promise<void>
  sendMessage: (message: string) => void
  leaveRoom: () => void
  wsStatus: ILLA_WEBSOCKET_STATUS
}

export interface TipisWebSocketProviderProps {
  children: ReactNode
}

export interface IInitWSCallback {
  onConnecting: (isConnecting: boolean) => void
  onMessageCallBack: (callbackData: Callback<unknown>) => void
  address: string
}
