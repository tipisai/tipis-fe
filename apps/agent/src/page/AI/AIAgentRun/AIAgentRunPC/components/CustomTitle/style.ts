import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const titleAndIconContainerStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const iconStyle = css`
  width: 48px;
  height: 48px;
  flex: none;
`

export const titleStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  font-weight: 500;
  line-height: 22px;
`
