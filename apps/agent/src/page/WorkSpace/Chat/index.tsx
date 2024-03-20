import { FC } from "react"
import { useTranslation } from "react-i18next"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import CustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import DefaultChat from "./chatHistory"
import HeaderTools from "./components/HeaderTools"
import { ChatWSProvider } from "./context"
import { chatContainerStyle } from "./style"

const ChatPage: FC = () => {
  const { t } = useTranslation()
  return (
    <TipisWebSocketProvider>
      <ChatWSProvider>
        <LayoutAutoChange
          desktopPage={
            <div css={chatContainerStyle}>
              <WorkspacePCHeaderLayout
                title={t("Tipi")}
                extra={<HeaderTools />}
                customRenderTitle={(title) => (
                  <CustomTitle title={title} iconURL={""} />
                )}
              />
              <DefaultChat isMobile={false} />
            </div>
          }
          mobilePage={<DefaultChat isMobile />}
        />
      </ChatWSProvider>
    </TipisWebSocketProvider>
  )
}

export default ChatPage
