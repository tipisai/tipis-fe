import { FC } from "react"
import { useTranslation } from "react-i18next"
import CustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import HeaderTools from "../components/HeaderTools"
import DefaultChat from "./chatHistory"
import { chatContainerStyle } from "./style"

const ChatContent: FC = () => {
  const { t } = useTranslation()
  return (
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
  )
}

export default ChatContent
