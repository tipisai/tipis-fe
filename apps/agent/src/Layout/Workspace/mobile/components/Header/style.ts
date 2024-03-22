import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const headerLayoutContainerStyle = css`
  display: flex;
  height: 64px;
  width: 100%;
  padding: 12px 6px;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`

export const titleAndTitleDescContainerStyle = css`
  display: flex;
  padding: 8px 0;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

export const titleDescStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

export const closeIconStyle = css`
  font-size: 20px !important;
`
