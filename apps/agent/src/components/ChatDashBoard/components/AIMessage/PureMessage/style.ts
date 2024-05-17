import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const pureMessageContainerStyle = css`
  border-radius: 16px;
  background: ${getColor("grayBlue", "09")};
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
  ${applyMobileStyle(css`
    margin-right: 0;
  `)}
`

export const markdownHoverCopyStyle = css`
  display: inline-flex;
  padding: 4px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background: ${getColor("white", "01")};
  cursor: pointer;
  color: ${getColor("grayBlue", "02")};
  transform: translateX(-4px);
`
