import { css } from "@emotion/react"
import { baseMenuItemNameStyle, baseMenuItemStyle } from "../baseTabStyle"

export const menuItemStyle = css`
  ${baseMenuItemStyle}
  :hover {
    .menu-item-inner-container {
      background-color: rgba(16, 9, 116, 0.06);
    }
  }
`

export const menuItemNameStyle = css`
  ${baseMenuItemNameStyle}
  font-weight: 500;
`
