import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 100%;
  padding-bottom: 8px;
`

export const functionContainerStyle = css`
  width: 100%;
  padding-bottom: 8px;
  gap: 16px;
  display: flex;
  flex-direction: column;
`

export const titleStyle = css`
  display: flex;
  padding: 24px 24px 18px 24px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${getColor("grayBlue", "02")};
`
