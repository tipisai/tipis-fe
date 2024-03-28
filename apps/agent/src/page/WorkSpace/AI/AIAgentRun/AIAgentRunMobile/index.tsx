import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { track } from "@/utils/mixpanelHelper"
import { IAgentForm } from "../../AIAgent/interface"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { previewChatContainer } from "./style"

export const AIAgentRunMobile: FC = () => {
  const { control, getValues, getFieldState } = useFormContext<IAgentForm>()

  const [agentType, aiAgentID] = useWatch({
    control,
    name: ["agentType", "aiAgentID"],
  })

  const {
    wsStatus,
    isRunning,
    chatMessages,
    isReceiving,
    sendMessage,
    setIsReceiving,
    lastRunAgent,
    connect,
    isConnecting,
    inRoomUsers,
  } = useContext(AgentWSContext)

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

  const isVariablesDirty = getFieldState("variables")?.isDirty

  const blockInputDirty = useMemo(() => {
    if (lastRunAgent === undefined) {
      return true
    }

    return isVariablesDirty
  }, [lastRunAgent, isVariablesDirty])

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
    if (wsStatus === ILLA_WEBSOCKET_STATUS.INIT && !isConnecting) {
      connect()
    }
  }, [agentType, aiAgentID, connect, isConnecting, wsStatus])

  return (
    <>
      <ChatContext.Provider value={{ inRoomUsers }}>
        <div css={previewChatContainer}>
          <PreviewChat
            editState="RUN"
            isMobile
            blockInput={!isRunning || blockInputDirty}
            onSendMessage={onSendMessage}
            wsContextValue={wsContext}
          />
        </div>
      </ChatContext.Provider>
    </>
  )
}

export default AIAgentRunMobile

AIAgentRunMobile.displayName = "AIAgentRunMobile"
