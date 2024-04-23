import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const contentContainerStyle = css`
  width: 100%;
  height: 100%;
  border-top: 1px solid ${getColor("grayBlue", "08")};
  overflow: hidden;
  overflow-x: auto;
  display: flex;
`

export const innerContentContainerStyle = css`
  display: flex;
  margin: 0 auto;
`

export const leftPlaceContentStyle = css`
  min-width: 240px;
  max-width: 400px;
  display: flex;
  padding: 8px 24px;
  width: 240px;
`
