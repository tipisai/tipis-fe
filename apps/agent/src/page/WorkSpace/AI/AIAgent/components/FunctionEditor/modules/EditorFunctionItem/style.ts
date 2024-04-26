import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const functionItemContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const functionNameStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: ${getColor("grayBlue", "02")};
`
