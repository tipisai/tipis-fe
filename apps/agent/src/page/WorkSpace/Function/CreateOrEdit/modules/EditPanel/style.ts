import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const editPanelContainerStyle = css`
  min-width: 480px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const basicContainerStyle = css`
  width: 100%;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const dividerStyle = css`
  height: 1px;
  width: 100%;
  background-color: ${getColor("grayBlue", "08")};
`
