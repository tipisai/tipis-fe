import { FC, memo, useCallback, useContext, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { PreviewChat } from "@/components/PreviewChat"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { IAgentForm } from "../../interface"
import { IPreviewChatHistoryProps } from "./interface"
import { rightPanelContainerStyle } from "./style"

const PreviewChatHistory: FC<IPreviewChatHistoryProps> = memo(
  (props: IPreviewChatHistoryProps) => {
    const { getValues, getFieldState } = useFormContext<IAgentForm>()
    const {
      wsStatus,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      setIsReceiving,
      lastRunAgent,
    } = useContext(AgentWSContext)

    const isPromptDirty = getFieldState("prompt").isDirty
    const isVariablesDirty = getFieldState("variables").isDirty
    const isKnowledgeDirty = getFieldState("knowledge").isDirty

    const getIsBlockInputDirty = useCallback(() => {
      if (!isRunning) {
        return true
      }
      if (lastRunAgent.current === undefined) {
        return true
      }
      return isPromptDirty || isVariablesDirty || isKnowledgeDirty
    }, [
      isKnowledgeDirty,
      isPromptDirty,
      isRunning,
      isVariablesDirty,
      lastRunAgent,
    ])

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
        const {
          payload,
          signal,
          type,
          fileIDs,
          updateMessage,
          messageContent,
        } = getSendMessageBody(message, getValues("aiAgentID"))

        sendMessage(payload, signal, type, {
          fileIDs,
          updateMessage,
          messageContent,
        })
      },
      [getValues, sendMessage],
    )

    return (
      <PreviewChatUseProvider
        useTo={
          !!getValues("aiAgentID")
            ? PREVIEW_CHAT_USE_TO.EDIT_TIPI
            : PREVIEW_CHAT_USE_TO.CREATE_TIPI
        }
      >
        <div css={rightPanelContainerStyle}>
          <PreviewChat
            isMobile={!!props.isMobile}
            editState="EDIT"
            blockInput={getIsBlockInputDirty()}
            onSendMessage={onSendMessage}
            wsContextValue={wsContext}
          />
        </div>
      </PreviewChatUseProvider>
    )
  },
)

PreviewChatHistory.displayName = "PreviewChat"

export default PreviewChatHistory
