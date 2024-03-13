import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const pageWrapperStyle = css`
  width: 100%;
  padding-bottom: 48px;
  color: ${getColor("grayBlue", "02")};
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
`

export const billingHeaderStyle = css`
  padding: 40px 0;
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
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  gap: 64px;
  align-items: center;
`
