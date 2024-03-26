import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const sortWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${getColor("white", "01")};
  padding-bottom: 8px;
`
