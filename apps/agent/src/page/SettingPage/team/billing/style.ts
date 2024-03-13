import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const infoTitleStyle = css`
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  ${applyMobileStyle(css`
    font-size: 16px;
    line-height: 20px;
  `)}
`
