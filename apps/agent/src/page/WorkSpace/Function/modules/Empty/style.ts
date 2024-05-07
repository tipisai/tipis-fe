import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const emptyTipisContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

export const emptyTipisTipTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const emptyOuterContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
