import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "../../AI/components/ChatContext"
import { ChatStableWSContext, ChatUnStableWSContext } from "../context"
import { INIT_CHAT_CONFIG } from "./constants"
import { rightPanelContainerStyle } from "./style"

export const DefaultChat: FC = () => {
  const { connect, leaveRoom, sendMessage, setIsReceiving } =
    useContext(ChatStableWSContext)

  const { getReadyState, isRunning, chatMessages, isReceiving, inRoomUsers } =
    useContext(ChatUnStableWSContext)

  const wsContext = useMemo(
    () => ({
      getReadyState,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      setIsReceiving,
    }),
    [
      chatMessages,
      isReceiving,
      isRunning,
      sendMessage,
      setIsReceiving,
      getReadyState,
    ],
  )

  const onSendMessage = useCallback(
    (message: ChatMessage) => {
      sendMessage(
        {
          threadID: message.threadID,
          prompt: message.message,
          ...INIT_CHAT_CONFIG,
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        SEND_MESSAGE_WS_TYPE.CHAT,
        {
          fileIDs: message?.knowledgeFiles?.map((item) => item.fileID) || [],
          updateMessage: true,
          messageContent: message,
        },
      )
    },
    [sendMessage],
  )

  useEffect(() => {
    connect()
    return () => {
      leaveRoom()
    }
  }, [connect, leaveRoom])

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <PreviewChatUseProvider useTo={PREVIEW_CHAT_USE_TO.DEFAULT_CHAT}>
        <div css={rightPanelContainerStyle}>
          <PreviewChat
            editState="RUN"
            blockInput={!isRunning}
            wsContextValue={wsContext}
            onSendMessage={onSendMessage}
          />
        </div>
      </PreviewChatUseProvider>
    </ChatContext.Provider>
  )
}

export default DefaultChat

DefaultChat.displayName = "DefaultChat"
