import { FC } from "react"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import StartButton from "../../../components/StartButton"
import { EditPanelContent } from "../../../modules/EditPanel/content"
import { pcEditPanelContainerStyle } from "./style"

const PCEditPanel: FC = () => {
  return (
    <EditPanelLayout footerChildren={<StartButton />}>
      <div css={pcEditPanelContainerStyle}>
        <EditPanelContent />
      </div>
    </EditPanelLayout>
  )
}

export default PCEditPanel
