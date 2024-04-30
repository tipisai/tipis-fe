import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

const basLayoutContainerStyle = css`
  display: flex;
  padding: 8px 16px;
  width: 100%;
`

export const RowContainerStyle = css`
  ${basLayoutContainerStyle};
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

export const labelStyle = (enabled: boolean) => css`
  font-size: 14px;
  color: ${enabled ? getColor("grayBlue", "02") : getColor("grayBlue", "04")};
  line-height: 22px;
  font-weight: 500;
  white-space: nowrap;
  width: 200px;
  ${applyMobileStyle(css`
    width: auto;
  `)}
`
