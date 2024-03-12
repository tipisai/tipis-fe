import { FC, useContext, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import { PreviewChat } from "@/page/AI/components/PreviewChat"
import { ILLA_WEBSOCKET_STATUS } from "../../../../api/ws/interface"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { previewChatContainer } from "./style"

export const AIAgentRunMobile: FC = () => {
  const { control } = useFormContext<Agent>()

  const { isDirty } = useFormState({
    control,
  })

  const [agentType, model, aiAgentID] = useWatch({
    control,
    name: ["agentType", "model", "aiAgentID"],
  })

  const { inRoomUsers, isRunning, wsStatus, isConnecting, connect } =
    useContext(AgentWSContext)

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
            agentType={agentType}
            model={model}
            blockInput={!isRunning || isDirty}
          />
        </div>
      </ChatContext.Provider>
    </>
  )
}

export default AIAgentRunMobile

AIAgentRunMobile.displayName = "AIAgentRunMobile"
