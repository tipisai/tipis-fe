import { FC, memo, useCallback, useContext, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { TextSignal } from "@/api/ws/textSignal"
import { PreviewChat } from "@/components/PreviewChat"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"
import { track } from "@/utils/mixpanelHelper"
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

    return (
      <div css={rightPanelContainerStyle}>
        <MixpanelTrackProvider
          basicTrack={track}
          pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
        >
          <PreviewChat
            isMobile={!!props.isMobile}
            editState="EDIT"
            blockInput={getIsBlockInputDirty()}
            onSendMessage={onSendMessage}
            wsContextValue={wsContext}
          />
        </MixpanelTrackProvider>
      </div>
    )
  },
)

PreviewChatHistory.displayName = "PreviewChat"

export default PreviewChatHistory
