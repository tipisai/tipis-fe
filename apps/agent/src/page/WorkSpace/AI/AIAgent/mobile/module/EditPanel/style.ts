import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const publishModalContentStyle = css`
  border-top: 1px solid ${getColor("grayBlue", "08")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
`
