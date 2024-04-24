import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const labelWithEditorLabelContainerStyle = css`
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
`

export const labelStyle = css`
  font-size: 12px;
  color: ${getColor("grayBlue", "02")};
  font-weight: 500;
  line-height: 20px;
  width: 120px;
  flex: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
`
