import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const agentBlockStyle = (isMobile: boolean) => css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${isMobile ? "0px" : "8px 0px"};
`

export function applyBlockTextStyle(
  renderBottomLine?: boolean,
): SerializedStyles {
  return css`
    color: ${getColor("grayBlue", "02")};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    border-bottom: ${renderBottomLine
      ? `1px dashed ${getColor("grayBlue", "06")}`
      : "none"};
  `
}

export const blockTitleContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const blockTItleAndRequireContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
`

export function applyBlockSubtitleStyle(
  renderBottomLine?: boolean,
): SerializedStyles {
  return css`
    display: inline-flex;
    align-items: center;
    border-bottom: ${renderBottomLine
      ? `1px dashed ${getColor("grayBlue", "06")}`
      : "none"};
  `
}

export const childrenAndErrorMessageContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const titleAndDescriptionContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const descriptionStyle = css`
  width: 100%;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`
