import { TextSignal, TextTarget, WEBSOCKET_ERROR_CODE } from "./textSignal"

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
  errorCode: WEBSOCKET_ERROR_CODE
  target: TextTarget
  signal: TextSignal
}

export enum FILE_SOURCE {
  FILES = "files",
  TEMPORARY_FILES = "temporaryFiles",
}
