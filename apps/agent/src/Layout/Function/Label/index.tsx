import { FC } from "react"
import { ILabelProps } from "./interface"
import { labelContainerStyle, labelStyle } from "./style"

const Label: FC<ILabelProps> = (props) => {
  const { title } = props
  return (
    <div css={labelContainerStyle}>
      <p css={labelStyle}>{title}</p>
    </div>
  )
}

export default Label
