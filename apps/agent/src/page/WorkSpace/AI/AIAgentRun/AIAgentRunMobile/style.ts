import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const previewChatContainer = css`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-top: 1px solid ${getColor("grayBlue", "08")};
`
