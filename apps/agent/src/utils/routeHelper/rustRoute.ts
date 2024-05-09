import { UnlistenFn } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/tauri"
import { appWindow } from "@tauri-apps/api/window"
import { useEffect, useRef } from "react"
import { v4 } from "uuid"
import { IS_IN_APP_CLIENT } from "@illa-public/cross-platform-utils"
import { useGetCurrentTeamInfo } from "../team"
import { useNavigateToExploreTipis, useNavigateToNewChat } from "./hook"

export const useRustNavigateToNewChat = () => {
  const navigateToNewChat = useNavigateToNewChat()

  return () => {
    navigateToNewChat(v4())
  }
}

export const useInitRustEvent = () => {
  const currentTeamInfo = useGetCurrentTeamInfo()
  const rustNavigateToNewChat = useRustNavigateToNewChat()
  const navigateToExploreTipi = useNavigateToExploreTipis()

  const openNewChatListenerRef = useRef<Promise<UnlistenFn>>()
  const openExploreTipiListenerRef = useRef<Promise<UnlistenFn>>()

  useEffect(() => {
    if (!IS_IN_APP_CLIENT) return
    const chatListener = openNewChatListenerRef.current
    const exploreListener = openExploreTipiListenerRef.current
    if (!currentTeamInfo) {
      invoke("set_enabled_new_chat", { enabled: false })
      invoke("set_enabled_explore_tipi", { enabled: false })
      if (chatListener) {
        chatListener.then((f) => f())
      }
      if (exploreListener) {
        exploreListener.then((f) => f())
      }
    } else {
      invoke("set_enabled_new_chat", { enabled: true })
      invoke("set_enabled_explore_tipi", { enabled: true })
      if (!chatListener) {
        openNewChatListenerRef.current = appWindow.listen(
          "open_new_chat",
          rustNavigateToNewChat,
        )
      }
      if (!exploreListener) {
        openExploreTipiListenerRef.current = appWindow.listen(
          "open_explore_tipi",
          navigateToExploreTipi,
        )
      }
    }
  }, [currentTeamInfo, navigateToExploreTipi, rustNavigateToNewChat])
}
