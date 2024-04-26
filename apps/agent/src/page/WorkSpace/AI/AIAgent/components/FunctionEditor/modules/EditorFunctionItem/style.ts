import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const functionItemContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

const baseFunctionNameStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const functionNameStyle = css`
  ${baseFunctionNameStyle};
  color: ${getColor("grayBlue", "02")};
`

export const deletedFunctionNameStyle = css`
  ${baseFunctionNameStyle};
  color: ${getColor("red", "03")};
`

export const deletedIconStyle = css`
  display: flex;
  width: 32px;
  height: 32px;
  padding: 9px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: ${getColor("grayBlue", "09")};
`
