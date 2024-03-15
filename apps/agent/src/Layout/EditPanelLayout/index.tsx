import { FC } from "react"
import { IEditPanelLayoutProps } from "./interface"
import {
  editContentStyle,
  editPanelContainerStyle,
  footerContainerStyle,
} from "./style"

const EditPanelLayout: FC<IEditPanelLayoutProps> = (props) => {
  const { children, footerChildren, customWidth = "528px" } = props
  return (
    <div css={editPanelContainerStyle}>
      <div css={editContentStyle(customWidth)}>{children}</div>
      <div css={footerContainerStyle(customWidth)}>{footerChildren}</div>
    </div>
  )
}

export default EditPanelLayout
