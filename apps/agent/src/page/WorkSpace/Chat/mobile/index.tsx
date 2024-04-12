import { FC } from "react"
import { useTranslation } from "react-i18next"
import MobileCustomTitle from "@/Layout/Workspace/mobile/components/CustomTitle"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import defaultCHatIconURL from "@/assets/public/tipiChatAvatar.svg"
import HeaderTools from "../components/HeaderTools"
import DefaultChat from "../module/chatHistory"

const MobileChatPage: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <MobileFirstPageLayout
        headerExtra={<HeaderTools />}
        title={t("homepage.left_panel.tab.tipi_chat")}
        customRenderTitle={(title) => (
          <MobileCustomTitle title={title} iconURL={defaultCHatIconURL} />
        )}
      >
        <DefaultChat isMobile />
      </MobileFirstPageLayout>
    </>
  )
}

export default MobileChatPage
