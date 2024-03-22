import { FC } from "react"
import { useTranslation } from "react-i18next"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import HeaderTools from "../components/HeaderTools"
import DefaultChat from "../module/chatHistory"

const MobileChatPage: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <MobileFirstPageLayout
        headerExtra={<HeaderTools />}
        title={t("homepage.left_panel.tab.tipi_chat")}
      >
        <DefaultChat isMobile />
      </MobileFirstPageLayout>
    </>
  )
}

export default MobileChatPage
