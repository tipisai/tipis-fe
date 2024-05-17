import { FC, useEffect } from "react"
import { useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { ChatWSProvider } from "@/components/ChatDashBoard/context"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useAddChatTab } from "@/utils/recentTabs/hook"
import PCChatPage from "./pc"

const ChatPage: FC = () => {
  const { chatID } = useParams()
  const addChatTab = useAddChatTab()

  useEffect(() => {
    if (chatID && chatID !== DEFAULT_CHAT_ID) {
      addChatTab(chatID)
    }
  }, [addChatTab, chatID])

  return (
    <ChatWSProvider>
      <LayoutAutoChange desktopPage={<PCChatPage />} />
    </ChatWSProvider>
  )
}

export default ChatPage
