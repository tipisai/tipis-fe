import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const menuWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const applyMobileLinkStyle = (selected: boolean): SerializedStyles => {
  const selectedStyle = selected
    ? css`
        background: ${getColor("techPurple", "08")};
        color: ${getColor("techPurple", "03")};
        font-weight: 500;
      `
    : ""

  return css`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: ${getColor("grayBlue", "02")};
    cursor: pointer;
    ${selectedStyle};
  `
}

export const applyLinkStyle = (selected: boolean): SerializedStyles => {
  const selectedStyle = selected
    ? css`
        background: ${getColor("grayBlue", "09")};
        font-weight: 600;
      `
    : null

  return css`
    display: flex;
    align-items: center;
    padding: 9px 24px 9px 48px;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: ${getColor("grayBlue", "02")};
    cursor: pointer;
    ${selectedStyle};
  `
}

// Mobile

export const mobileMenuWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`
