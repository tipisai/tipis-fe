import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const ParametersContainerStyle = css`
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
`

export const labelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`
