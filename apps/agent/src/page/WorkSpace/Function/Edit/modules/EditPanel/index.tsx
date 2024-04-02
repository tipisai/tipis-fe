import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import AvatarUploader from "./components/AvatarUploader"
import DescriptionEditor from "./components/DescriptionEditor"
import NameEditor from "./components/NameEditor"
import ParametersEditor from "./components/ParametersEditor"

const EditPanel: FC = () => {
  const { t } = useTranslation()

  return (
    <EditPanelLayout
      customWidth="900px"
      footerChildren={
        <Button block size="large" type="default">
          {t("editor.ai-agent.start")}
        </Button>
      }
    >
      <AvatarUploader />
      <NameEditor />
      <DescriptionEditor />
      <ParametersEditor />
    </EditPanelLayout>
  )
}

export default EditPanel
