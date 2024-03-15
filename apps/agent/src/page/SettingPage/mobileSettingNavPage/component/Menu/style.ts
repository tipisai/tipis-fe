import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const menuItemStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  color: ${getColor("grayBlue", "02")};
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  &:hover {
    background-color: ${getColor("grayBlue", "09")};
  }
`

export const rightIconStyle = css`
  color: ${getColor("grayBlue", "04")};
`
