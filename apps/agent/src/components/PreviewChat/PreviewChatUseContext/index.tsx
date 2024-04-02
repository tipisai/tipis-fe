import { FC, createContext } from "react"
import {
  IPreviewChatUseContextInject,
  IPreviewChatUseProviderProps,
} from "./interface"

export const PreviewChatUseContext =
  createContext<IPreviewChatUseContextInject>(
    {} as IPreviewChatUseContextInject,
  )

export const PreviewChatUseProvider: FC<IPreviewChatUseProviderProps> = ({
  useTo,
  children,
}) => {
  return (
    <PreviewChatUseContext.Provider value={{ useTo }}>
      {children}
    </PreviewChatUseContext.Provider>
  )
}
