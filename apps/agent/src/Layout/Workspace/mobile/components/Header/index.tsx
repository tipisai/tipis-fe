import Icon from "@ant-design/icons"
import { Button } from "antd"
import { memo } from "react"
import { Helmet } from "react-helmet-async"
import { PreviousIcon } from "@illa-public/icon"
import { IWorkspaceHeaderLayoutProps } from "./interface"
import {
  closeIconStyle,
  headerLayoutContainerStyle,
  titleAndTitleDescContainerStyle,
  titleDescStyle,
  titleStyle,
} from "./style"

const WorkspaceMobileHeaderLayout = memo(
  (props: IWorkspaceHeaderLayoutProps) => {
    const {
      title,
      titleDesc,
      extra,
      closeIcon = PreviousIcon,
      onClickClose,
    } = props
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <header css={headerLayoutContainerStyle}>
          <Button
            type="text"
            shape="circle"
            icon={<Icon component={closeIcon} css={closeIconStyle} />}
            onClick={onClickClose}
            size="large"
          />
          <div css={titleAndTitleDescContainerStyle}>
            <h1 css={titleStyle}>{title}</h1>
            {titleDesc && <span css={titleDescStyle}>{titleDesc}</span>}
          </div>
          {extra}
        </header>
      </>
    )
  },
)

WorkspaceMobileHeaderLayout.displayName = "WorkspaceHeaderLayout"

export default WorkspaceMobileHeaderLayout
