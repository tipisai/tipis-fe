import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { ChatContext } from "../AI/components/ChatContext"
import { INIT_CHAT_CONFIG } from "./constants"
import { ChatWSContext } from "./context"
import { rightPanelContainerStyle } from "./style"

export const DefaultChat: FC<{ isMobile: boolean }> = ({
  isMobile = false,
}) => {
  const {
    inRoomUsers,
    isRunning,
    connect,
    wsStatus,
    leaveRoom,
    chatMessages,
    isReceiving,
    sendMessage,
    setIsReceiving,
  } = useContext(ChatWSContext)

  const onlyConnectOnce = useRef(false)

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
        "chat",
        true,
        message,
      )
    },
    [sendMessage],
  )

  useEffect(() => {
    return () => {
      if (
        wsStatus === ILLA_WEBSOCKET_STATUS.CONNECTED &&
        onlyConnectOnce.current === true
      ) {
        leaveRoom()
        onlyConnectOnce.current = false
      }
    }
  }, [leaveRoom, wsStatus])

  useEffect(() => {
    if (
      onlyConnectOnce.current === false &&
      wsStatus === ILLA_WEBSOCKET_STATUS.INIT
    ) {
      connect()
      onlyConnectOnce.current = true
    }
  }, [connect, wsStatus])

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <div css={rightPanelContainerStyle}>
        <PreviewChat
          isMobile={isMobile}
          editState="RUN"
          model={INIT_CHAT_CONFIG.model}
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