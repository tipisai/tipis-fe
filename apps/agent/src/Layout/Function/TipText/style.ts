import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const errorMsgStyle = css`
  font-size: 14px;
  line-height: 22px;
  color: ${getColor("grayBlue", "03")};
  display: flex;
  align-items: center;
  gap: 8px;
`