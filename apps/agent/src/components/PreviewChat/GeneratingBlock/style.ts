import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const generatingContainerStyle = css`
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
  left: 0;
  top: -32px;
  position: absolute;
`

export const generatingContentContainerStyle = css`
  display: inline-flex;
  pointer-events: auto;
  flex-direction: row;
  align-items: center;
  background: ${getColor("white", "01")};
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  padding: 4px 15px;
`
export const generatingTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`

export const generatingDividerStyle = css`
  width: 1px;
  height: 12px;
  margin-left: 10px;
  margin-right: 10px;
  background: ${getColor("grayBlue", "08")};
`

export const stopIconStyle = css`
  cursor: pointer;
`
