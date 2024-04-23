import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const labelStyle = css`
  flex: none;
  width: 100%;
  color: ${getColor("grayBlue", "02")};
  text-align: right;
  font-weight: 500;
  line-height: 22px;
  font-size: 14px;
`

export const labelContainerStyle = css`
  width: 160px;
  flex: none;
  display: flex;
  align-items: center;
`
