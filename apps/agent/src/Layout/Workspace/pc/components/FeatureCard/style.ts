import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

const cardPositionMapBorderRadius = {
  left: "12px 8px 8px 12px",
  right: "8px 12px 12px 8px",
  full: "12px",
}

export const featureCardContainerStyle = (
  cardPosition: "left" | "right" | "full",
) => css`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 4px;
  background-color: rgba(16, 9, 116, 0.06);
  width: 100%;
  border-radius: ${cardPositionMapBorderRadius[cardPosition]};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  :hover {
    background-color: rgba(16, 9, 116, 0.08);
  }
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`
