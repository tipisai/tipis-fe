import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const sortWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start;
  flex-shrink: 0;
  background: ${getColor("white", "01")};
  padding-bottom: 8px;
`

export const sortHeaderStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: flex;
  padding: 0 20px;
`
