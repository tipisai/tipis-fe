import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const chatContainerStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 110px;
  width: 100%;
`

export const maxWidthStyle = css`
  width: 100%;
  max-width: 832px;
  padding: 0 16px;
  ${applyMobileStyle(css`
    padding: 0 20px;
  `)}
`
