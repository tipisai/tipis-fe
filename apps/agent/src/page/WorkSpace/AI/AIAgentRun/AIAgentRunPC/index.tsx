import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { PreviewChat } from "@/components/PreviewChat"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
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

  const { canOpenModal, changeIsModalOpen } = useContext(
    InputVariablesModalContext,
  )

  const hasVariables = fieldArray[0].length > 0

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
        wsStatus === ILLA_WEBSOCKET_STATUS.CONNECTED &&
        onlyConnectOnce.current === true
      ) {
        leaveRoom()
        onlyConnectOnce.current = false
      }
    }
  }, [leaveRoom, wsStatus])

  const initRunAgent = useCallback(() => {
    if (!hasVariables) {
      if (
        onlyConnectOnce.current === false &&
        wsStatus === ILLA_WEBSOCKET_STATUS.INIT
      ) {
        connect()
        onlyConnectOnce.current = true
      }
      return
    }
    if (!canOpenModal.current) return
    changeIsModalOpen(true)
  }, [canOpenModal, changeIsModalOpen, connect, hasVariables, wsStatus])

  useEffect(() => {
    initRunAgent()
  }, [initRunAgent])

  return (
    <>
      <ChatContext.Provider value={{ inRoomUsers }}>
        <div css={rightPanelContainerStyle}>
          <PreviewChat
            isMobile={false}
            editState="RUN"
            blockInput={getIsBlockInputDirty()}
            wsContextValue={wsContext}
            onSendMessage={onSendMessage}
          />
        </div>
      </ChatContext.Provider>
    </>
  )
}

export default AIAgentRunPC

AIAgentRunPC.displayName = "AIAgentRunPC"
