import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const headerFieldContainerStyle = css`
  width: 100%;
  padding: 5px 0;
  height: 32px;
`
export const headerTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`
