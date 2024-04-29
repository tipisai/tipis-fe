import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const modalContentContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const itemsContainerStyle = css`
  width: 100%;
  flex: 1;
  padding-top: 16px;
  overflow-y: auto;
`

export const actionContainerStyle = css`
  width: 100%;
  display: flex;
  padding: 12px 10px;
  gap: 8px;
  flex: none;
  border-top: 1px solid ${getColor("grayBlue", "08")};
`
