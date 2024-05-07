import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const intervalContainerStyle = (enabled: boolean) => css`
  display: flex;
  width: 206px;
  align-items: center;
  gap: 8px;
  color: ${enabled ? getColor("grayBlue", "02") : getColor("grayBlue", "04")};
`

export const labelStyle = css`
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
`
