import { FC, useCallback, useContext, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import { getChatMessageAndUIState } from "@/utils/localForage/teamData"
import { ChatContext } from "../components/ChatContext"
import { AgentWSContext } from "../context/AgentWSContext"
import { useGetModeAndTabID } from "../hook"
import EditPanel from "./modules/EditPanel"
import PreviewChatHistory from "./modules/PreviewChatHistory"
import { editAIAgentContainerStyle } from "./style"

export const AIAgent: FC = () => {
  const onlyConnectOnce = useRef(false)

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
