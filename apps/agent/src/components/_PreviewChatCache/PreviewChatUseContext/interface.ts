import { ReactNode } from "react"
import { PREVIEW_CHAT_USE_TO } from "./constants"

export interface IPreviewChatUseContextInject {
  useTo: PREVIEW_CHAT_USE_TO
}

export interface IPreviewChatUseProviderProps {
  useTo: PREVIEW_CHAT_USE_TO
  children: ReactNode
}
