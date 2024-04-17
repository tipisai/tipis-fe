import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const baseMenuItemStyle = css`
  position: relative;
  display: block;
  border: unset;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
`

export const baseMenuItemContainerStyle = (isMiniSize: boolean) => {
  const baseStyle = css`
    display: flex;
    width: 100%;
    align-items: center;
    transition: background-color 0.2s linear;
  `

  const miniStyle = css`
    ${baseStyle};
    height: 32px;
    justify-content: center;
    padding: 4px;
    border-radius: 8px;
  `

  const manualStyle = css`
    ${baseStyle}
    display: flex;
    width: 100%;
    padding: 8px;
    gap: 8px;
    border-radius: 16px;
  `

  return isMiniSize ? miniStyle : manualStyle
}

export const baseMenuItemNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  line-height: 22px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const baseActionIconContainerStyle = css`
  flex: none;
  width: 24px;
  height: 24px;
  .ant-btn {
    transition: all 0.2s linear;
  }
`

// PC

export const basePCMenuItemButtonCustomIconContainerStyle = css`
  font-size: 16px;
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const pcActionButtonStyle = (canShow: boolean) => {
  return css`
    ${baseActionIconContainerStyle}
    visibility: ${canShow ? "visible" : "hidden"};
    opacity: ${canShow ? "1" : "0"};
  `
}

export const draggingStyle = css`
  opacity: 0.5;
`

export const baseOuterContainerStyle = (isMiniSize: boolean) => css`
  padding: ${isMiniSize ? "4px 12px" : "4px 16px"};
`
