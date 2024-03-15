import { FC, memo } from "react"
import { LayoutContainerProps } from "./interface"
import {
  columnLayoutContainerStyle,
  columnLayoutHeaderStyle,
  extLabelStyle,
  labelContainerStyle,
  labelStyle,
} from "./style"

const ColumnLayoutContainer: FC<LayoutContainerProps> = memo(
  (props: LayoutContainerProps) => {
    const { labelName, children, extHeaderNode, extLabel } = props
    return (
      <div css={columnLayoutContainerStyle}>
        {(labelName || extHeaderNode) && (
          <header css={columnLayoutHeaderStyle}>
            {labelName && (
              <div css={labelContainerStyle}>
                <span css={labelStyle}>{labelName}</span>
                {extLabel && <span css={extLabelStyle}>{extLabel}</span>}
              </div>
            )}
            {extHeaderNode && extHeaderNode}
          </header>
        )}
        {children}
      </div>
    )
  },
)
ColumnLayoutContainer.displayName = "ColumnLayoutContainer"

export default ColumnLayoutContainer
