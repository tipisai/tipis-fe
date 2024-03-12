import { memo } from "react"
import { Helmet } from "react-helmet-async"
import { IWorkspaceHeaderLayoutProps } from "./interface"
import {
  headerLayoutContainerStyle,
  titleAndTitleDescContainerStyle,
  titleDescStyle,
  titleStyle,
} from "./style"

const WorkspaceMobileHeaderLayout = memo(
  (props: IWorkspaceHeaderLayoutProps) => {
    const { title, titleDesc, extra, customRenderTitle } = props
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <header css={headerLayoutContainerStyle}>
          {customRenderTitle ? (
            customRenderTitle(title, titleDesc)
          ) : (
            <div css={titleAndTitleDescContainerStyle}>
              <h1 css={titleStyle}>{title}</h1>
              {titleDesc && <span css={titleDescStyle}>{titleDesc}</span>}
            </div>
          )}
          {extra}
        </header>
      </>
    )
  },
)

WorkspaceMobileHeaderLayout.displayName = "WorkspaceHeaderLayout"

export default WorkspaceMobileHeaderLayout
