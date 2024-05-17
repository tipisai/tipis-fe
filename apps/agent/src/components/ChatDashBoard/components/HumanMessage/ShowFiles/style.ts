import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const containerStyle = css`
  gap: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-wrap: wrap;
  ${applyMobileStyle(css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  `)}
`

export const fileContainerStyle = css`
  width: auto;
  ${applyMobileStyle(css`
    width: 100%;
  `)}
`
