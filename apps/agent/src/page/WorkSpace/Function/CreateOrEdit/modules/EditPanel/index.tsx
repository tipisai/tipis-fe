import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { IFunctionInterface } from "@illa-public/public-types"
import AvatarUploader from "../../components/EditField/AvatarUploader"
import DescriptionEditor from "../../components/EditField/DescriptionEditor"
import IntegrationEditor from "../../components/EditField/IntegrationEditor"
import NameEditor from "../../components/EditField/NameEditor"
// import VariableEditor from "../../components/EditField/VariableEditor"
import EventEditor from "../EventEditor"
import {
  basicContainerStyle,
  dividerStyle,
  editPanelContainerStyle,
} from "./style"

const EditPanel: FC = () => {
  const { control } = useFormContext<IFunctionInterface>()

  const integrationID = useWatch({
    control,
    name: "resourceID",
  })

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
        {/* {!!integrationID && <VariableEditor />} */}
        {!!integrationID && <EventEditor />}
      </div>
    </div>
  )
}

export default EditPanel
