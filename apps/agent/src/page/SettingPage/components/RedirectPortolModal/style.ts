import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const modalCloseIconStyle = css`
  position: absolute;
  width: 24px;
  height: 24px;
  line-height: 10px;
  text-align: center;
  top: 18px;
  right: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
`

export const contentStyle = css`
  text-align: center;
  padding: 24px 0;
`

export const imgStyle = css`
  width: 226px;
  height: 64px;
`

export const labelStyle = css`
  font-size: 18px;
  font-weight: 500;
  margin-top: 48px;
`
