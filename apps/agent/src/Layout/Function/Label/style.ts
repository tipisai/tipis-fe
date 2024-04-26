import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const labelContainerStyle = css`
  width: 160px;
  flex: none;
  display: flex;
  padding: 9px 0;
  gap: 4px;
`

export const labelStyle = css`
  width: 100%;
  color: ${getColor("grayBlue", "02")};
  text-align: right;
  font-weight: 500;
  line-height: 22px;
  font-size: 14px;
`

export const requiredIconStyle = css`
  flex: none;
  width: 8px;
  height: 8px;
`

export const iconContainerStyle = css`
  line-height: 22px;
`
