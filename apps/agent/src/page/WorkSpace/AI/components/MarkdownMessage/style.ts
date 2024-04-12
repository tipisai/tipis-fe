import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const markdownMessageContainerStyle = css`
  width: 100%;
  overflow: hidden;
`

export const markdownMessageStyle = css`
  max-width: 100%;
  overflow-x: hidden;
  word-break: break-word;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`

export const cellStyle = css`
  min-width: 100px;
`

export const tableStyle = css`
  margin: 8px 0;
`

export const listStyle = css`
  margin: auto;
  padding-left: 16px;
`
