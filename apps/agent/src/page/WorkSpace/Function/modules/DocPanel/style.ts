import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const docPanelStyle = css`
  width: 400px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 24px;
`

export const blockStyle = css`
  display: flex;
  gap: 8px;
  flex-direction: column;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const descStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`

export const imageStyle = css`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f2f3f5;
`
