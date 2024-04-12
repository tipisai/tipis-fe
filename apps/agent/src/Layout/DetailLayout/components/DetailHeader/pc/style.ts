import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const detailHeaderContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const detailTitleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
`

export const detailDescStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 14px;
  font-size: 400;
  line-height: 22px;
`
