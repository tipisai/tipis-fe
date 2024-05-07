import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { getCurrentId } from "@illa-public/user-data"
import { PreviewChat } from "@/components/PreviewChat"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
import { getChatMessageAndUIState } from "@/utils/localForage/uiState"
import { IAgentForm } from "../../AIAgent/interface"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { InputVariablesModalContext } from "./context/InputVariablesModalContext"
import { rightPanelContainerStyle } from "./style"

export const AIAgentRunPC: FC = () => {
  const { control, getValues, getFieldState } = useFormContext<IAgentForm>()

  const fieldArray = useWatch({
    control: control,
    name: ["variables", "model", "prompt", "agentType"],
  })

  const teamID = useSelector(getCurrentId)
  const { canOpenModal, changeIsModalOpen } = useContext(
    InputVariablesModalContext,
  )

  const hasVariables = fieldArray[0].length > 0

  const {
    inRoomUsers,
    isRunning,
    connect,
    getReadyState,
    leaveRoom,
    chatMessages,
    isReceiving,
    sendMessage,
    lastRunAgent,
    tabID,
    currentRenderMessage,
  } = useContext(AgentWSContext)

  const isVariablesDirty = getFieldState("variables").isDirty

  const getIsBlockInputDirty = useCallback(() => {
    if (!isRunning) {
      return true
    }
    if (lastRunAgent.current === undefined) {
      return true
    }
    return isVariablesDirty
  }, [isRunning, isVariablesDirty, lastRunAgent])

  const onlyConnectOnce = useRef(false)

  const wsContext = useMemo(
    () => ({
      getReadyState,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      lastRunAgent,
      currentRenderMessage,
    }),
    [
      chatMessages,
      isReceiving,
      isRunning,
      lastRunAgent,
      sendMessage,
      getReadyState,
      currentRenderMessage,
    ],
  )

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
    return () => {
      if (
        getReadyState() !== WS_READYSTATE.UNINITIALIZED &&
        onlyConnectOnce.current === true
      ) {
        leaveRoom()
        onlyConnectOnce.current = false
      }
    }
  }, [leaveRoom, getReadyState])

  const initRunAgent = useCallback(async () => {
    const { chatMessageData, uiChatMessage } = await getChatMessageAndUIState(
      teamID!,
      tabID,
    )

    const hasChatHistory =
      Array.isArray(uiChatMessage) &&
      Array.isArray(chatMessageData) &&
      uiChatMessage.length > 0 &&
      chatMessageData.length > 0

    if (!hasVariables || hasChatHistory) {
      if (
        onlyConnectOnce.current === false &&
        getReadyState() === WS_READYSTATE.UNINITIALIZED
      ) {
        connect()
        onlyConnectOnce.current = true
        canOpenModal.current = false
      }
      return
    }
    if (!canOpenModal.current) return
    changeIsModalOpen(true)
  }, [
    teamID,
    tabID,
    hasVariables,
    canOpenModal,
    changeIsModalOpen,
    getReadyState,
    connect,
  ])

  useEffect(() => {
    initRunAgent()
  }, [initRunAgent])

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <PreviewChatUseProvider useTo={PREVIEW_CHAT_USE_TO.RUN}>
        <div css={rightPanelContainerStyle}>
          <PreviewChat
            blockInput={getIsBlockInputDirty()}
            wsContextValue={wsContext}
            onSendMessage={onSendMessage}
          />
        </div>
      </PreviewChatUseProvider>
    </ChatContext.Provider>
  )
}

export default AIAgentRunPC

AIAgentRunPC.displayName = "AIAgentRunPC"
