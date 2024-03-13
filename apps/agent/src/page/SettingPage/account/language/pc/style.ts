import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const innerContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  max-width: 600px;
  width: 100%;
`

export const formFieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`

export const formTitleStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${getColor("grayBlue", "02")};
`

export const containerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
