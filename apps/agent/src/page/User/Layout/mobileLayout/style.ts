import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const layoutStyle = css`
  height: 100%;
  background: linear-gradient(180deg, #f5e9fe 0%, #e4e2ff 49.5%, #e9def3 100%);
  background-size: contain;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px 40px 16px;
`

export const headerStyle = css`
  display: flex;
`

export const logoStyle = css`
  height: 32px;
  width: auto;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
`

export const contentStyle = css`
  height: 100%;
  width: 100%;
  margin-top: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: ${getColor("white", "01")};
  padding: 32px 20px 20px;
  font-size: 14px;
`

export const policyStyle = css`
  margin-top: 40px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: ${getColor("grayBlue", "03")};
`
