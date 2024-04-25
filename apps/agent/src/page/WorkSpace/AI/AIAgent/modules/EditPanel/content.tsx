import { FC } from "react"
import AvatarUploader from "../../components/AvatarUploader"
import DescriptionEditor from "../../components/DescriptionEditor"
import KnowledgeEditor from "../../components/KnowledgeEditor"
import NameEditor from "../../components/NameEditor"
import PromptEditor from "../../components/PromptEditor"
import ScheduleEditor from "../../components/ScheduleEditor"
import VariableEditor from "../../components/VariableEditor"

export const EditPanelContent: FC = () => {
  return (
    <>
      <AvatarUploader />
      <NameEditor />
      <DescriptionEditor />
      <PromptEditor />
      <VariableEditor />
      <KnowledgeEditor />
      <ScheduleEditor />
    </>
  )
}
