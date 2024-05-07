import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useAddChatTab } from "@/utils/recentTabs/hook"
import { ChatContext } from "../../AI/components/ChatContext"
import { ChatStableWSContext, ChatUnStableWSContext } from "../context"
import { INIT_CHAT_CONFIG } from "./constants"
import { rightPanelContainerStyle } from "./style"

export const ChatHistory: FC = () => {
  const { chatID } = useParams()

  const { connect, leaveRoom, sendMessage } = useContext(ChatStableWSContext)

  const {
    getReadyState,
    isRunning,
    chatMessages,
    isReceiving,
    inRoomUsers,
    currentRenderMessage,
  } = useContext(ChatUnStableWSContext)

  const addChatTab = useAddChatTab()

  const wsContext = useMemo(
    () => ({
      getReadyState,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      currentRenderMessage,
    }),
    [
      chatMessages,
      isReceiving,
      isRunning,
      sendMessage,
      getReadyState,
      currentRenderMessage,
    ],
  )

  const onSendMessage = useCallback(
    (message: ChatMessage) => {
      if (DEFAULT_CHAT_ID === chatID) {
        addChatTab(DEFAULT_CHAT_ID)
      }
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
    [addChatTab, chatID, sendMessage],
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
            blockInput={!isRunning}
            wsContextValue={wsContext}
            onSendMessage={onSendMessage}
          />
        </div>
      </PreviewChatUseProvider>
    </ChatContext.Provider>
  )
}

export default ChatHistory

ChatHistory.displayName = "DefaultChat"
