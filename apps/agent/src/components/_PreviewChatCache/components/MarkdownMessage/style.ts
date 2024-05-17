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
  color: ${getColor("grayBlue", "02")};
  border-bottom: none;
  padding: 10px 8px;
  border-right: 1px solid ${getColor("grayBlue", "08")};
  &:last-of-type {
    border-right: none;
  }
`

export const rowStyle = css`
  border-bottom: 1px solid ${getColor("grayBlue", "08")};
  &:last-of-type {
    border-bottom: none;
  }
`

export const headStyle = css`
  border-bottom: 1px solid ${getColor("grayBlue", "08")};
`

export const thStyle = css`
  color: ${getColor("grayBlue", "02")};
  background-color: #f8f9fa;
  padding: 13px 8px;
  border-bottom: none;
  text-align: start;
  border-right: 1px solid ${getColor("grayBlue", "08")};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  &:last-of-type {
    border-right: none;
  }
`

export const tableStyle = css`
  margin: 8px 0;
  box-shadow: unset;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "08")};
`

export const listStyle = css`
  margin: auto;
  padding-left: 16px;
`
