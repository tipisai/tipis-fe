import { FC, useContext, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import { PreviewChat } from "@/page/AI/components/PreviewChat"
import { ILLA_WEBSOCKET_STATUS } from "../../../../api/ws/interface"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { rightPanelContainerStyle } from "./style"

export const AIAgentRunPC: FC = () => {
  const { control } = useFormContext<Agent>()

  const { isDirty } = useFormState({
    control,
  })

  const [model, agentType, aiAgentID] = useWatch({
    control,
    name: ["model", "agentType", "aiAgentID"],
  })

  const { inRoomUsers, isRunning, connect, wsStatus, isConnecting } =
    useContext(AgentWSContext)

  useEffect(() => {
    if (wsStatus === ILLA_WEBSOCKET_STATUS.INIT && !isConnecting) {
      connect(aiAgentID, agentType)
    }
  }, [agentType, aiAgentID, connect, isConnecting, wsStatus])

  return (
    <>
      <ChatContext.Provider value={{ inRoomUsers }}>
        <div css={rightPanelContainerStyle}>
          <PreviewChat
            isMobile={false}
            editState="RUN"
            agentType={agentType}
            model={model}
            blockInput={!isRunning || isDirty}
          />
        </div>
      </ChatContext.Provider>
    </>
  )
}

export default AIAgentRunPC

AIAgentRunPC.displayName = "AIAgentRunPC"
