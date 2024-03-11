import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const errorMsgStyle = css`
  position: relative;
  font-size: 14px;
  padding-left: 24px;
  line-height: 22px;
  color: ${getColor("orange", "03")};
  ${applyMobileStyle(css`
    position: absolute;
    font-size: 12px;
    padding-left: 4px;
    bottom: 0;
    transform: translateY(100%);
  `)}
`

export const errorIconStyle = css`
  position: absolute;
  font-size: 16px;
  line-height: 0;
  top: 3px;
  left: 0;
  ${applyMobileStyle(css`
    display: none;
  `)}
`
