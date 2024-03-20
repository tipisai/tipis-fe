import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import DefaultChat from "./chatHistory"
import { ChatWSProvider } from "./context"

const ChatPage: FC = () => {
  return (
    <TipisWebSocketProvider>
      <ChatWSProvider>
        <LayoutAutoChange
          desktopPage={<DefaultChat isMobile={false} />}
          mobilePage={<DefaultChat isMobile />}
        />
      </ChatWSProvider>
    </TipisWebSocketProvider>
  )
}

export default ChatPage
