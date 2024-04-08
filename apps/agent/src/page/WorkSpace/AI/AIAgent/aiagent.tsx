import { FC, useCallback, useContext, useEffect, useRef } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { useSelector } from "react-redux"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import { getChatMessageAndUIState } from "@/utils/localForage/teamData"
import { ChatContext } from "../components/ChatContext"
import { AgentWSContext } from "../context/AgentWSContext"
import { useGetModeAndTabID } from "../hook"
import EditPanel from "./modules/EditPanel"
import PreviewChatHistory from "./modules/PreviewChatHistory"
import { editAIAgentContainerStyle } from "./style"

export const AIAgent: FC = () => {
  const { control } = useFormContext<Agent>()
  const onlyConnectOnce = useRef(false)

  const { isDirty } = useFormState({
    control,
  })
  const teamID = useSelector(getCurrentId)!

  const { inRoomUsers, getReadyState, leaveRoom, connect } =
    useContext(AgentWSContext)
  const { mode, finalTabID } = useGetModeAndTabID()

  const initRunAgent = useCallback(async () => {
    const wsStatus = getReadyState()
    const { chatMessageData, uiChatMessage } = await getChatMessageAndUIState(
      teamID,
      finalTabID,
      mode,
    )
    const hasChatHistory =
      Array.isArray(uiChatMessage) &&
      Array.isArray(chatMessageData) &&
      uiChatMessage.length > 0 &&
      chatMessageData.length > 0
    if (
      hasChatHistory &&
      onlyConnectOnce.current === false &&
      wsStatus === WS_READYSTATE.UNINITIALIZED
    ) {
      connect()
      onlyConnectOnce.current = true
    }
  }, [connect, finalTabID, mode, teamID, getReadyState])

  useEffect(() => {
    initRunAgent()
  }, [initRunAgent])

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
      const wsStatus = getReadyState()
      if (wsStatus === WS_READYSTATE.OPEN) {
        leaveRoom()
      }
    }
  }, [leaveRoom, getReadyState])

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
