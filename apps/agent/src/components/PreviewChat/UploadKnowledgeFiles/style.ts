import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const fileItemContainerStyle = css`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
`

export const fileTypeIconStyle = css`
  height: 16px;
  margin-right: 4px;
`

export const fileNameStyle = css``

export const closeIconStyle = (isError: boolean) => css`
  display: flex;
  width: 8px;
  height: 8px;
  font-size: 8px;
  color: ${isError ? getColor("red", "03") : getColor("grayBlue", "02")};
`
