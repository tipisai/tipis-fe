import { FC } from "react"
import { IRowContainerProps } from "./interface"
import { RowContainerStyle, labelStyle } from "./style"

const RowContainer: FC<IRowContainerProps> = (props) => {
  const { labelName, children, enabled } = props
  return (
    <div css={RowContainerStyle}>
      {labelName && <span css={labelStyle(enabled)}>{labelName}</span>}
      {children}
    </div>
  )
}

export default RowContainer
