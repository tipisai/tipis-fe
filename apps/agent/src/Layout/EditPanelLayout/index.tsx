import { FC } from "react"
import { IEditPanelLayoutProps } from "./interface"
import {
  editContentStyle,
  editPanelContainerStyle,
  footerContainerStyle,
} from "./style"

const EditPanelLayout: FC<IEditPanelLayoutProps> = (props) => {
  const {
    children,
    footerChildren,
    customWidth = "528px",
    canResize = false,
    isMobile = false,
  } = props
  return (
    <div css={editPanelContainerStyle(customWidth, canResize)}>
      <div css={editContentStyle(customWidth)}>{children}</div>
      {footerChildren && (
        <div css={footerContainerStyle(customWidth, isMobile)}>
          {footerChildren}
        </div>
      )}
    </div>
  )
}

export default EditPanelLayout
