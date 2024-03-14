import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const modalTitleStyle = css`
  padding: 16px 40px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  justify-content: center;
  border-bottom: 1px solid ${getColor("grayBlue", "08")};
  ${applyMobileStyle(css`
    padding: 24px 24px 16px 24px;
    font-weight: 500;
    line-height: 24px;
    text-align: start;
    border-bottom: none;
  `)}
`

export const modalContentStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  font-weight: 400;
  line-height: 22px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${applyMobileStyle(css`
    padding: 0 24px;
  `)}
`

export const footerStyle = css`
  display: flex;
  gap: 8px;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  padding: 24px 24px;
  border-top: 1px solid ${getColor("grayBlue", "08")};
  ${applyMobileStyle(css`
    border-top: none;
  `)}
`
