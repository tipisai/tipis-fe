import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { track } from "@/utils/mixpanelHelper"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { rightPanelContainerStyle } from "./style"

export const AIAgentRunPC: FC = () => {
  const { control, getValues } = useFormContext<Agent>()

  const { isDirty } = useFormState({
    control,
  })

  const [model] = useWatch({
    control,
    name: ["model"],
  })

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
    lastRunAgent,
  } = useContext(AgentWSContext)

  const onlyConnectOnce = useRef(false)

  const wsContext = useMemo(
    () => ({
      wsStatus,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      setIsReceiving,
      lastRunAgent,
    }),
    [
      chatMessages,
      isReceiving,
      isRunning,
      lastRunAgent,
      sendMessage,
      setIsReceiving,
      wsStatus,
    ],
  )

  const onSendMessage = useCallback(
    (message: ChatMessage) => {
      track(
        ILLA_MIXPANEL_EVENT_TYPE.CLICK,
        ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
        {
          element: "send",
          parameter5: getValues("aiAgentID"),
        },
      )
      sendMessage(
        {
          threadID: message.threadID,
          prompt: message.message,
          variables: [],
          actionID: getValues("aiAgentID"),
          modelConfig: getValues("modelConfig"),
          model: getValues("model"),
          agentType: getValues("agentType"),
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        "chat",
        true,
        message,
      )
    },
    [getValues, sendMessage],
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
          isMobile={false}
          editState="RUN"
          model={model}
          blockInput={!isRunning || isDirty}
          wsContextValue={wsContext}
          onSendMessage={onSendMessage}
        />
      </div>
    </ChatContext.Provider>
  )
}

export default AIAgentRunPC

AIAgentRunPC.displayName = "AIAgentRunPC"
