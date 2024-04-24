import { FC } from "react"
import { LabelWithEditorProps } from "./interface"
import {
  descriptionStyle,
  labelStyle,
  labelWithEditorLabelContainerStyle,
  outerContainerStyle,
} from "./style"

const LabelWithEditor: FC<LabelWithEditorProps> = (props) => {
  const { children, label, description } = props
  return (
    <div css={outerContainerStyle}>
      <div css={labelWithEditorLabelContainerStyle}>
        <p css={labelStyle}>{label}</p>
        {children}
      </div>
      {description && (
        <div css={labelWithEditorLabelContainerStyle}>
          <div css={labelStyle} />
          <div css={descriptionStyle}>{description}</div>
        </div>
      )}
    </div>
  )
}

export default LabelWithEditor
