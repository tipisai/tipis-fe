import { FC, useContext, useEffect } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { ChatContext } from "../components/ChatContext"
import { AgentWSContext } from "../context/AgentWSContext"
import EditPanel from "./modules/EditPanel"
import PreviewChatHistory from "./modules/PreviewChatHistory"
import { editAIAgentContainerStyle } from "./style"

export const AIAgent: FC = () => {
  const { control } = useFormContext<Agent>()

  const { isDirty } = useFormState({
    control,
  })

  const { inRoomUsers, wsStatus, leaveRoom } = useContext(AgentWSContext)

  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", unload)
    window.addEventListener("onunload", unload)
    return () => {
      window.removeEventListener("beforeunload", unload)
      window.removeEventListener("onunload", unload)
    }
  }, [isDirty])

  useEffect(() => {
    return () => {
      if (wsStatus === ILLA_WEBSOCKET_STATUS.CONNECTED) {
        leaveRoom()
      }
    }
  }, [leaveRoom, wsStatus])

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <div css={editAIAgentContainerStyle}>
        <EditPanel />
        <LayoutAutoChange
          desktopPage={<PreviewChatHistory />}
          mobilePage={null}
        />
      </div>
    </ChatContext.Provider>
  )
}

AIAgent.displayName = "AIAgent"
