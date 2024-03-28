import { FC, memo, useCallback, useContext, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { PreviewChat } from "@/components/PreviewChat"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
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
        // track(
        //   ILLA_MIXPANEL_EVENT_TYPE.CLICK,
        //   ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
        //   {
        //     element: "send",
        //     parameter5: getValues("aiAgentID"),
        //   },
        // )
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
