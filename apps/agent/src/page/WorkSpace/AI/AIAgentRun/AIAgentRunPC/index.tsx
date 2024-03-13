import { FC, useContext, useEffect, useRef } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import { PreviewChat } from "@/page/WorkSpace/AI/components/PreviewChat"
import { ChatContext } from "../../components/ChatContext"
import { AgentWSContext } from "../../context/AgentWSContext"
import { rightPanelContainerStyle } from "./style"

export const AIAgentRunPC: FC = () => {
  const { control } = useFormContext<Agent>()

  const { isDirty } = useFormState({
    control,
  })

  const [model, agentType] = useWatch({
    control,
    name: ["model", "agentType"],
  })

  const { inRoomUsers, isRunning, connect, wsStatus, leaveRoom } =
    useContext(AgentWSContext)

  const onlyConnectOnce = useRef(false)

  useEffect(() => {
    if (onlyConnectOnce.current === false) {
      connect()
      onlyConnectOnce.current = true
    }
  }, [connect, leaveRoom, wsStatus])

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
