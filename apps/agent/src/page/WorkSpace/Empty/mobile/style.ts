import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const contentContainerStyle = css`
  display: flex;
  padding-top: 86px;
  flex-direction: column;
  align-items: center;
`

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
`

export const emptyIconStyle = css`
  width: 80px;
  height: 80px;
  font-size: 80px;
`
