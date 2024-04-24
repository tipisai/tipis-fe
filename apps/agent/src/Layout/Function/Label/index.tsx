import { FC } from "react"
import RequireIcon from "@/assets/agent/require.svg?react"
import { ILabelProps } from "./interface"
import { labelContainerStyle, labelStyle, requiredIconStyle } from "./style"

const Label: FC<ILabelProps> = (props) => {
  const { title, required } = props
  return (
    <div css={labelContainerStyle}>
      <p css={labelStyle}>{title}</p>
      {required && <RequireIcon css={requiredIconStyle} />}
    </div>
  )
}

export default Label
