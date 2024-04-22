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
  tipisContainerStyle,
  tipisOuterContainerStyle,
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
        <div css={tipisOuterContainerStyle}>
          <div css={tipisContainerStyle}>
            To help the model better understand the parameters required for this
            function, please add variables and describe them. The added
            variables can be directly accessed when configuring the interface.
          </div>
        </div>
        <IntegrationEditor />
        <VariableEditor />
      </div>
    </div>
  )
}

export default EditPanel
