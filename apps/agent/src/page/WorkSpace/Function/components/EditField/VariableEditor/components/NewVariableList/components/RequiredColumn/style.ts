import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const descriptionContainerStyle = css`
  width: 60px;
  flex: none;
  display: flex;
  flex-direction: column;
`

export const listItemContainerStyle = css`
  width: 100%;
  padding: 5px 0;
  overflow: hidden;
  height: 32px;
  display: flex;
  align-items: center;
`

export const successIconStyle = css`
  color: ${getColor("green", "03")};
`

export const errorIconStyle = css`
  color: ${getColor("grayBlue", "04")};
`
