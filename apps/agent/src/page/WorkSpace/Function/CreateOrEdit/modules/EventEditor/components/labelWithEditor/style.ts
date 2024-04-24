import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const outerContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

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

export const descriptionStyle = css`
  width: 100%;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`
