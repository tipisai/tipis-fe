import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const popoverContentContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 208px;
  gap: 2px;
`

export const buttonContentContainerStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const iconContainerStyle = css`
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`
