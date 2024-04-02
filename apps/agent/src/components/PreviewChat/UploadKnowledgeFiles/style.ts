import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const fileItemContainerStyle = css`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
  gap: 8px;
`

export const fileNameStyle = css`
  font-size: 12px;
  display: block;
  max-width: 150px;
  color: ${getColor("grayBlue", "02")};
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: none;
`
export const closeIconStyle = (isError: boolean) => css`
  display: flex;
  flex: none;
  width: 8px;
  height: 8px;
  font-size: 8px;
  color: ${isError ? getColor("red", "03") : getColor("grayBlue", "02")};
`
