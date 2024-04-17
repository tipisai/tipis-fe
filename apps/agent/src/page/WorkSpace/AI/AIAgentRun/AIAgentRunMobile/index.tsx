import { FC, useCallback, useContext, useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { PreviewChat } from "@/components/PreviewChat"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
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
    getReadyState,
    isRunning,
    chatMessages,
    isReceiving,
    sendMessage,
    lastRunAgent,
    connect,
    isConnecting,
    inRoomUsers,
  } = useContext(AgentWSContext)

  const wsContext = useMemo(
    () => ({
      getReadyState,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      lastRunAgent,
    }),
    [
      chatMessages,
      isReceiving,
      isRunning,
      lastRunAgent,
      sendMessage,
      getReadyState,
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
    if (getReadyState() === WS_READYSTATE.UNINITIALIZED && !isConnecting) {
      connect()
    }
  }, [agentType, aiAgentID, connect, isConnecting, getReadyState])

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <PreviewChatUseProvider useTo={PREVIEW_CHAT_USE_TO.RUN}>
        <div css={previewChatContainer}>
          <PreviewChat
            blockInput={!isRunning || blockInputDirty}
            onSendMessage={onSendMessage}
            wsContextValue={wsContext}
          />
        </div>
      </PreviewChatUseProvider>
    </ChatContext.Provider>
  )
}

export default AIAgentRunMobile

AIAgentRunMobile.displayName = "AIAgentRunMobile"
