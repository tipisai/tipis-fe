import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { PreviewChat } from "@/components/PreviewChat"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
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
      const { payload, signal, type, fileIDs, updateMessage, messageContent } =
        getSendMessageBody(message, getValues("aiAgentID"))

      sendMessage(payload, signal, type, {
        fileIDs,
        updateMessage,
        messageContent,
      })
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
