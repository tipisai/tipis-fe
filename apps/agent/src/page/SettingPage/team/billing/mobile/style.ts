import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const pageWrapperStyle = css`
  width: 100%;
  padding-bottom: 24px;
  color: ${getColor("grayBlue", "02")};
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`

export const billingHeaderStyle = css`
  padding: 8px 24px 20px 24px;
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
`

export const billingMainContentStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const contentContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 64px;
  align-items: center;
`
