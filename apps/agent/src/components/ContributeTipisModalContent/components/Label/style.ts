import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const firstLabelContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const secondLabelStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  width: 100%;
`

export const firstLabelStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  font-weight: 500;
  line-height: 22px;
`
