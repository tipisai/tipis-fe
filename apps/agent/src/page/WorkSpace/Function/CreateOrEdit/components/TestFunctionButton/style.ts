import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const testFunctionRunContainerStyle = css`
  display: flex;
  gap: 8px;
`

export const actionRunResultButtonStyle = css`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 12px;
  border-radius: 20px;
  background-color: ${getColor("green", "08")};
  cursor: pointer;
`

export const iconAndTextContainerStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const textStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
`

export const iconContainerStyle = css`
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const nextIconStyle = css`
  transform: rotate(90deg);
  color: ${getColor("green", "03")};
  font-size: 12px;
`
