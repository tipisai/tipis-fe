import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const contentContainerStyle = css`
  width: 100%;
  height: 100%;
  border-top: 1px solid ${getColor("grayBlue", "08")};
  overflow: hidden;
  overflow-x: auto;
  display: flex;
  position: relative;
`

export const leftPlaceContentStyle = css`
  min-width: 240px;
  max-width: 400px;
  display: flex;
  padding: 8px 24px;
  width: 240px;
`

export const formStyle = css`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
