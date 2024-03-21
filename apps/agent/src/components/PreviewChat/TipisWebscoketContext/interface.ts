import { ReactNode } from "react"
import { Callback, ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"

export type AgentMessageType = "chat" | "stop_all" | "clean"

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
  onReceiving: (isReceiving: boolean) => void
  onConnecting: (isConnecting: boolean) => void
  onMessageSuccessCallback: (callbackData: Callback<unknown>) => void
  onMessageFailedCallback: (callbackData: Callback<unknown>) => void
  address: string
}
