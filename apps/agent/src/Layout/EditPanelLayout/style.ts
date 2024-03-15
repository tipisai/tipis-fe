import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const editPanelContainerStyle = css`
  padding: 16px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid ${getColor("grayBlue", "08")};
  background-color: ${getColor("white", "01")};
  border-top: 1px solid ${getColor("grayBlue", "08")};
`

export const editContentStyle = css`
  display: flex;
  width: 528px;
  height: 100%;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  overflow-y: auto;
`

export const footerContainerStyle = css`
  width: 528px;
  padding: 24px 24px 8px 24px;
  border-top: 1px solid ${getColor("grayBlue", "08")};
  background-color: ${getColor("white", "01")};
`
