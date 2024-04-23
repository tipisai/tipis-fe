import { FC } from "react"
import Label from "../Label"
import { ILabelWithControllerProps } from "./interface"
import { labelWithContainerStyle } from "./style"

const LabelWithController: FC<ILabelWithControllerProps> = (props) => {
  const { title, children } = props
  return (
    <div css={labelWithContainerStyle}>
      <Label title={title} />
      {children}
    </div>
  )
}

export default LabelWithController
