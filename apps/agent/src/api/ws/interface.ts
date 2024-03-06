import { TextSignal, TextTarget } from "./textSignal"

export enum ILLA_WEBSOCKET_STATUS {
  INIT = "INIT",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  CLOSED = "CLOSED",
  FAILED = "FAILED",
  LOCKING = "LOCKING",
}

export interface Broadcast {
  type: string
  payload: any
}

export interface Callback<T> {
  broadcast: Broadcast
  // extra data
  data: T
  // string
  errorMessage: string
  // 0 success, not zero error
  errorCode: number
  target: TextTarget
  signal: TextSignal
}
