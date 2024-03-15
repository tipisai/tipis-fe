import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const containerStyle = css`
  ${applyMobileStyle(css`
    position: absolute;
    z-index: 9;
    right: 12px;
    top: 6px;
    transform: translateY(100%);
  `)}
`

export const subMenuLabelStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
