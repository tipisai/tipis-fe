import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const lineContainerStyle = css`
  display: flex;
  padding: 0px 32px;
  align-items: flex-start;
  gap: 8px;
`

export const lineStyle = css`
  width: 1px;
  height: 16px;
  background-color: ${getColor("grayBlue", "08")};
`
