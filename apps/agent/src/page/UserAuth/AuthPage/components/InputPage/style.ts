import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const inputPageContainerStyle = css`
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 80%;
`

export const logoStyle = css`
  height: 32px;
  width: auto;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`

export const authButtonContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`

export const policyStyle = css`
  font-size: 12px;
  line-height: 20px;
  width: 400px;
  color: ${getColor("grayBlue", "03")};
  text-align: center;
`
