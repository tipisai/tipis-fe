import { isEqual } from "lodash-es"
import { FC, memo, useCallback, useContext, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { PreviewChat } from "@/components/PreviewChat"
import { ChatMessage } from "@/components/PreviewChat/interface"
import { getSendMessageBody } from "@/utils/agent/wsUtils"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { IAgentForm } from "../../interface"
import { rightPanelContainerStyle } from "./style"

const PreviewChatHistory: FC = memo(() => {
  const { getValues, control } = useFormContext<IAgentForm>()
  const {
    getReadyState,
    isRunning,
    chatMessages,
    isReceiving,
    sendMessage,
    lastRunAgent,
    currentRenderMessage,
  } = useContext(AgentWSContext)
  const [prompt, variables, knowledge, aiTools] = useWatch({
    control,
    name: ["prompt", "variables", "knowledge", "aiTools"],
  })

  const getIsBlockInputDirty = useCallback(() => {
    if (!isRunning) {
      return true
    }
    if (lastRunAgent.current === undefined) {
      return true
    }
    const isPromptDirty = !isEqual(prompt, lastRunAgent.current.prompt)

    const isVariablesDirty = !isEqual(
      variables?.filter((item) => item.key !== "" && item.value !== ""),
      lastRunAgent.current.variables?.filter(
        (item) => item.key !== "" && item.value !== "",
      ),
    )

    const isKnowledgeDirty = !isEqual(knowledge, lastRunAgent.current.knowledge)

    const isToolsDirty = !isEqual(
      aiTools.map((item) => item.aiToolID),
      lastRunAgent.current.aiTools.map((item) => item.aiToolID),
    )

    return isPromptDirty || isVariablesDirty || isKnowledgeDirty || isToolsDirty
  }, [aiTools, isRunning, knowledge, lastRunAgent, prompt, variables])

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

  return (
    <div css={rightPanelContainerStyle}>
      <PreviewChat
        blockInput={getIsBlockInputDirty()}
        onSendMessage={onSendMessage}
        wsContextValue={wsContext}
      />
    </div>
  )
})

PreviewChatHistory.displayName = "PreviewChat"

export default PreviewChatHistory
