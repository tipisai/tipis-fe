import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const tagContentStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`

export const closeIconStyle = css`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 8px;
  color: ${getColor("techPurple", "03")};
`
