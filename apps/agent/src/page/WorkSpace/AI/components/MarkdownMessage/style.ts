import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const markdownMessageContainerStyle = css`
  width: 100%;
  max-width: 100%;
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

export const hoverCopyStyle = (isOwnMessage?: boolean) => css`
  display: inline-flex;
  padding: 4px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background: ${getColor("white", "01")};
  cursor: pointer;
  color: ${getColor("grayBlue", "02")};
  transform: translate(${isOwnMessage ? "-8px" : "8px"}, 12px);
`

export const cellStyle = css`
  min-width: 100px;
`

export const tableStyle = css`
  margin: 8px 0;
`
