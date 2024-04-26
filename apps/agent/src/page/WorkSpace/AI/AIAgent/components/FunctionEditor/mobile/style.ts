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

export const closeIconStyle = css`
  color: ${getColor("grayBlue", "02")};
`

export const titleStyle = css`
  display: flex;
  justify-content: center;
  text-align: center;
`
