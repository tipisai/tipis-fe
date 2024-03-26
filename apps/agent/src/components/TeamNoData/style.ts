import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const teamNoDataContainerStyle = css`
  width: 100%;
  height: 100%;
  padding: 120px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const emptyContentContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const iconContainerStyle = css`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  font-size: 48px;
`

export const emptyDescStyle = css`
  line-height: 22px;
  font-weight: 600;
  color: ${getColor("grayBlue", "02")};
`
