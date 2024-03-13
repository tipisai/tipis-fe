import { FC, useContext, useEffect } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
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

  const { inRoomUsers } = useContext(AgentWSContext)

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

  return (
    <ChatContext.Provider value={{ inRoomUsers }}>
      <div css={editAIAgentContainerStyle}>
        <EditPanel />
        <PreviewChatHistory />
      </div>
    </ChatContext.Provider>
  )
}

AIAgent.displayName = "AIAgent"
