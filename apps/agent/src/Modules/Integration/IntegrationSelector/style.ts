import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export const categoryStyle = css`
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${getColor("grayBlue", "04")};
`

export const resourceListStyle = css`
  padding: 8px 0;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(184px, 1fr));
`
