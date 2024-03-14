import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const modalContentStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  font-weight: 400;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const modalTitleStyle = css`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  justify-content: center;
`

export const footerStyle = css`
  display: flex;
  gap: 8px;
  flex-direction: row;
  width: 100%;
`
