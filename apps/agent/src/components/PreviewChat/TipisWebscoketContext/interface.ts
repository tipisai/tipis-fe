import { ReactNode } from "react"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { Callback } from "@/api/ws/interface"
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
  cleanMessage: () => void
  getReadyState: () => WS_READYSTATE
}

export interface TipisWebSocketProviderProps {
  children: ReactNode
}

export interface IInitWSCallback {
  onConnecting: (isConnecting: boolean) => void
  onMessageCallBack: (callbackData: Callback<unknown>) => void
  onCloseCallback: () => void
  address: string
}
