import { FC } from "react"
import { LabelWithEditorProps } from "./interface"
import { labelStyle, labelWithEditorLabelContainerStyle } from "./style"

const LabelWithEditor: FC<LabelWithEditorProps> = (props) => {
  const { children, label } = props
  return (
    <div css={labelWithEditorLabelContainerStyle}>
      <p css={labelStyle}>{label}</p>
      {children}
    </div>
  )
}

export default LabelWithEditor
