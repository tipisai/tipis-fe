import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const layoutWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 100%;
`

export const topWrapperStyle = css`
  display: flex;
  height: 80px;
  padding: 24px 40px;
  justify-content: flex-start;
  align-items: center;
`

export const bottomWrapperStyle = css`
  height: 100%;
  width: 100%;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  margin: auto;
`

export const logoStyle = css`
  height: 32px;
  width: auto;
`

export const policyStyle = css`
  margin-top: 24px;
  font-size: 12px;
  line-height: 20px;
  width: 400px;
  color: ${getColor("grayBlue", "03")};
`

export const linkPolicyStyle = css`
  font-size: 12px;
  color: ${getColor("techPurple", "03")};
  font-weight: 400;
  line-height: 20px;
  &:hover,
  &:active {
    color: ${getColor("techPurple", "04")};
  }
`
