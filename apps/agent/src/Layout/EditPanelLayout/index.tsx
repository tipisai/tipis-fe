import { FC } from "react"
import { IEditPanelLayoutProps } from "./interface"
import {
  editContentStyle,
  editPanelContainerStyle,
  footerContainerStyle,
} from "./style"

const EditPanelLayout: FC<IEditPanelLayoutProps> = (props) => {
  const { children, footerChildren } = props
  return (
    <div css={editPanelContainerStyle}>
      <div css={editContentStyle}>{children}</div>
      <div css={footerContainerStyle}>{footerChildren}</div>
    </div>
  )
}

export default EditPanelLayout
