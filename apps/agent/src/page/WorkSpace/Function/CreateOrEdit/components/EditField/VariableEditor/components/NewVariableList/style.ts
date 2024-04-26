import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const variableListContainerStyle = css`
  width: 100%;
  padding: 8px;
  border: 1px solid ${getColor("grayBlue", "08")};
  border-radius: 12px;
  display: flex;
  gap: 0px 16px;
`
