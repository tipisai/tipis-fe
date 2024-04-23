import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const enumOptionsEditorContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const enumOptionItemContainerStyle = css`
  display: flex;
  width: 100%;
`

export const subTitleStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`
