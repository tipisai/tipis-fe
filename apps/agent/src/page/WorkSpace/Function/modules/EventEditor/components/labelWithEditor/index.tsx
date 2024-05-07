import { memo } from "react"
import { LabelWithEditorProps } from "./interface"
import {
  descriptionStyle,
  labelStyle,
  labelWithEditorLabelContainerStyle,
  outerContainerStyle,
} from "./style"

const LabelWithEditor = memo((props: LabelWithEditorProps) => {
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
})

LabelWithEditor.displayName = "LabelWithEditor"

export default LabelWithEditor
