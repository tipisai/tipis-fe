import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const priceStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  ${applyMobileStyle(css`
    gap: 12px;
  `)}
`
export const infoTitleStyle = css`
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  ${applyMobileStyle(css`
    font-size: 16px;
    line-height: 20px;
    padding: 0 24px;
  `)}
`

export const priceCardContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: flex-start;
  ${applyMobileStyle(css`
    gap: 32px;
  `)}
`
