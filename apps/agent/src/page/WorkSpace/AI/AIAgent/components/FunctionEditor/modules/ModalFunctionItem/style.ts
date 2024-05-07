import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const functionItemContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  cursor: pointer;
  border-bottom: 1px solid ${getColor("grayBlue", "08")};
`

export const functionInfoStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const baseTextOverflowStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const functionNameStyle = css`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: ${getColor("grayBlue", "02")};
  ${baseTextOverflowStyle};
`

export const functionDescStyle = css`
  display: flex;
  align-items: center;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  ${baseTextOverflowStyle};
`
