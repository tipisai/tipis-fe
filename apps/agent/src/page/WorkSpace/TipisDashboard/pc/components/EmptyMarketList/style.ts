import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const listEmptyContainerStyle = css`
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 64px 200px;
`

export const emptyColorStyle = css`
  color: ${getColor("grayBlue", "04")};
`

export const emptyIconStyle = css`
  width: 48px;
  height: auto;
  font-size: 46px;
  color: ${getColor("grayBlue", "08")};
`
