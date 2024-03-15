import { FC, memo } from "react"
import { LayoutContainerProps } from "./interface"
import {
  labelStyle,
  rowLayoutContainerStyle,
  rowLayoutWithExtChildrenNodeInnerContainerStyle,
  rowLayoutWithExtChildrenNodeOuterContainerStyle,
} from "./style"

const RowLayoutContainer: FC<LayoutContainerProps> = memo(
  (props: LayoutContainerProps) => {
    const { labelName, children, extChildrenNode } = props
    return extChildrenNode ? (
      <div css={rowLayoutWithExtChildrenNodeOuterContainerStyle}>
        <div css={rowLayoutWithExtChildrenNodeInnerContainerStyle}>
          {labelName && <span css={labelStyle}>{labelName}</span>}
          {children}
        </div>
        <div css={rowLayoutWithExtChildrenNodeInnerContainerStyle}>
          <span css={labelStyle} />
          {extChildrenNode}
        </div>
      </div>
    ) : (
      <div css={rowLayoutContainerStyle}>
        {labelName && <span css={labelStyle}>{labelName}</span>}
        {children}
      </div>
    )
  },
)

RowLayoutContainer.displayName = "RowLayoutContainer"

export default RowLayoutContainer
