import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const titleStyle = css`
  display: flex;
  padding: 24px 24px 18px 24px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${getColor("grayBlue", "02")};
`
