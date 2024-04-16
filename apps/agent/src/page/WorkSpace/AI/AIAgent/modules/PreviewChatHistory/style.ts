import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const rightPanelContainerStyle = css`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  flex-direction: column;
  border-top: 1px solid ${getColor("grayBlue", "08")};
`
