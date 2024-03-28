import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "../../AI/components/ChatContext"
import { ChatStableWSContext, ChatUnStableWSContext } from "../context"
import { INIT_CHAT_CONFIG } from "./constants"
import { rightPanelContainerStyle } from "./style"

export const DefaultChat: FC<{ isMobile: boolean }> = ({
  isMobile = false,
}) => {
  const { connect, leaveRoom, sendMessage, setIsReceiving } =
    useContext(ChatStableWSContext)

  const { wsStatus, isRunning, chatMessages, isReceiving, inRoomUsers } =
    useContext(ChatUnStableWSContext)

  const wsContext = useMemo(
    () => ({
      wsStatus,
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
      wsStatus,
    ],
  )

  const onSendMessage = useCallback(
    (message: ChatMessage) => {
      // track(
      //   ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      //   ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
      //   {
      //     element: "send",
      //     parameter5: getValues("aiAgentID"),
      //   },
      // )
      sendMessage(
        {
          threadID: message.threadID,
          prompt: message.message,
          ...INIT_CHAT_CONFIG,
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        SEND_MESSAGE_WS_TYPE.CHAT,
        {
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
      <div css={rightPanelContainerStyle}>
        <PreviewChat
          isMobile={isMobile}
          editState="RUN"
          blockInput={!isRunning}
          wsContextValue={wsContext}
          onSendMessage={onSendMessage}
        />
      </div>
    </ChatContext.Provider>
  )
}

export default DefaultChat

DefaultChat.displayName = "DefaultChat"
