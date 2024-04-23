import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const textAlertContainerStyle = css`
  display: flex;
  padding: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  border-radius: 12px;
  background-color: #fafafa;
  width: 100%;
`

export const textAlertContentStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  width: 100%;
`
