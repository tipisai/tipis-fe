import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const rightPanelContainerStyle = css`
  height: 100%;
  display: flex;
  width: 100%;
  align-items: center;
  overflow-y: auto;
  flex-grow: 1;
  flex-direction: column;
  border-top: 1px solid ${getColor("grayBlue", "08")};
`

export const chatContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
