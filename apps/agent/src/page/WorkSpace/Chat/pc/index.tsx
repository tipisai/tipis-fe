import { FC } from "react"
import { useTranslation } from "react-i18next"
import PCCustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import defaultCHatIconURL from "@/assets/public/tipiChatAvatar.svg"
import { PreviewChat } from "@/components/ChatDashBoard"
import HeaderTools from "../components/HeaderTools"
import { chatContainerStyle } from "./style"

const PCChatPage: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={chatContainerStyle}>
      <WorkspacePCHeaderLayout
        title={t("homepage.left_panel.tab.tipi_chat")}
        extra={<HeaderTools />}
        customRenderTitle={(title) => (
          <PCCustomTitle title={title} iconURL={defaultCHatIconURL} />
        )}
      />
      <PreviewChat />
    </div>
  )
}

export default PCChatPage
