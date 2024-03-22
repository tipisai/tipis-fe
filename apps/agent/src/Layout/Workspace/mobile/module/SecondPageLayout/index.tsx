import { FC } from "react"
import { ErrorIcon } from "@illa-public/icon"
import WorkspaceMobileHeaderLayout from "../../components/Header"
import { ISecondPageLayoutProps } from "./interface"
import { mobileFirstPageLayoutContainerStyle } from "./style"

const MobileSecondPageLayout: FC<ISecondPageLayoutProps> = (props) => {
  const { headerExtra, children, customRenderTitle, title, onClickClose } =
    props

  return (
    <div css={mobileFirstPageLayoutContainerStyle}>
      <WorkspaceMobileHeaderLayout
        title={title}
        extra={headerExtra}
        closeIcon={ErrorIcon}
        onClickClose={onClickClose}
        customRenderTitle={customRenderTitle}
      />
      {children}
    </div>
  )
}

export default MobileSecondPageLayout
