import { isEqual } from "lodash-es"
import { FC, memo, useCallback, useContext, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { PreviewChat } from "@/components/PreviewChat"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
import { track } from "@/utils/mixpanelHelper"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { IPreviewChatHistoryProps } from "./interface"
import { rightPanelContainerStyle } from "./style"

const PreviewChatHistory: FC<IPreviewChatHistoryProps> = memo(
  (props: IPreviewChatHistoryProps) => {
    const { getValues, control } = useFormContext<Agent>()
    const {
      wsStatus,
      isRunning,
      chatMessages,
      isReceiving,
      sendMessage,
      setIsReceiving,
      lastRunAgent,
    } = useContext(AgentWSContext)

    const fieldArray = useWatch({
      control: control,
      name: ["variables", "model", "prompt", "agentType"],
    })

    const blockInputDirty = useMemo(() => {
      if (lastRunAgent === undefined) {
        return true
      }
      return (
        !isEqual(
          lastRunAgent.variables.filter((v) => v.key !== "" && v.value !== ""),
          fieldArray[0].filter((v) => v.key !== "" && v.value !== ""),
        ) ||
        !isEqual(lastRunAgent.model, fieldArray[1]) ||
        !isEqual(lastRunAgent.prompt, fieldArray[2]) ||
        !isEqual(lastRunAgent.agentType, fieldArray[3])
      )
    }, [lastRunAgent, fieldArray])

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
            blockInput={!isRunning || blockInputDirty}
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
