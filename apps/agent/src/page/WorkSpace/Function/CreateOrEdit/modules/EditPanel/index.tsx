import { FC } from "react"
import AvatarUploader from "../../components/EditField/AvatarUploader"
import DescriptionEditor from "../../components/EditField/DescriptionEditor"
import IntegrationEditor from "../../components/EditField/IntegrationEditor"
import NameEditor from "../../components/EditField/NameEditor"
import VariableEditor from "../../components/EditField/VariableEditor"
import {
  basicContainerStyle,
  dividerStyle,
  editPanelContainerStyle,
} from "./style"

const EditPanel: FC = () => {
  return (
    <div css={editPanelContainerStyle}>
      <div css={basicContainerStyle}>
        <AvatarUploader />
        <NameEditor />
        <DescriptionEditor />
      </div>
      <div css={dividerStyle} />
      <div css={basicContainerStyle}>
        <IntegrationEditor />
        <VariableEditor />
      </div>
    </div>
  )
}

export default EditPanel
