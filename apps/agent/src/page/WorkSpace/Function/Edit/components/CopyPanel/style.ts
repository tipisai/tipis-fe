import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const copyPanelStyle = css`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid ${getColor("grayBlue", "08")};
`

export const copyPanelHeaderStyle = css`
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${getColor("grayBlue", "08")};
  background-color: #fafafa;
`
export const headerTextStyle = css`
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  color: ${getColor("grayBlue", "02")};
`

export const contentContainerStyle = css`
  padding: 16px;
  background-color: #fafafa;
`

export const contentTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 400;
`
