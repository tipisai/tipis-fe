import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const emptyContainerStyle = css`
  height: 100%;
  padding-top: 253px;
`

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
`

export const emptyIconStyle = css`
  width: 80px;
  height: 80px;
  font-size: 80px;
`
