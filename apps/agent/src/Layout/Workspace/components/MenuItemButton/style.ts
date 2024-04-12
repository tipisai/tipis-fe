import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const menuItemButtonStyle = css`
  display: block;
  padding: 4px 16px;
  border: unset;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  .menu-item-inner-container {
    border-radius: 16px;
  }
  :hover {
    .menu-item-inner-container {
      background-color: rgba(16, 9, 116, 0.06);
    }
  }
`

export const menuItemButtonContentContainerStyle = css`
  display: flex;
  width: 100%;
  padding: 8px;
  gap: 8px;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: ${getColor("grayBlue", "02")};
`

export const menuItemButtonContentStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const menuItemButtonIconContainerStyle = css`
  font-size: 16px;
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`
