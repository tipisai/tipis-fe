import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const uploadContainerStyle = css`
  cursor: pointer;
  background: ${getColor("grayBlue", "09")};
  width: 100px;
  height: 100px;
  border-radius: 4px;
  display: flex;
  padding: 32px 28px 22px 29px;
  justify-content: center;
  align-items: center;
`

export const uploadContentContainerStyle = css`
  color: ${getColor("grayBlue", "04")};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`

export const uploadTextStyle = css`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`
