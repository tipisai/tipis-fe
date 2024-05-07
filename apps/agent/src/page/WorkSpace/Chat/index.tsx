import { FC, lazy, useEffect } from "react"
import { useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useAddChatTab } from "@/utils/recentTabs/hook"
import { ChatWSProvider } from "./context"

const MobileChatPage = lazy(() => import("@/page/WorkSpace/Chat/mobile"))
const PCChatPage = lazy(() => import("@/page/WorkSpace/Chat/pc"))

const ChatPage: FC = () => {
  const { chatID } = useParams()
  const addChatTab = useAddChatTab()

  useEffect(() => {
    if (chatID && chatID !== DEFAULT_CHAT_ID) {
      addChatTab(chatID)
    }
  }, [addChatTab, chatID])

  return (
    <TipisWebSocketProvider key={chatID}>
      <ChatWSProvider>
        <LayoutAutoChange
          desktopPage={<PCChatPage />}
          mobilePage={<MobileChatPage />}
        />
      </ChatWSProvider>
    </TipisWebSocketProvider>
  )
}

export default ChatPage
