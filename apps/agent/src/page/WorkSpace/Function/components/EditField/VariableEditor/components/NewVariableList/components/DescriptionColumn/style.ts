import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const descriptionContainerStyle = css`
  width: 100%;
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

export const descriptionTextStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
