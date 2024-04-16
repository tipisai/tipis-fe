import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const previewChatContainerStyle = css`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 16px;
`

export const inputTextContainerStyle = css`
  position: relative;
  background-color: ${getColor("white", "01")};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: none;
  ${applyMobileStyle(css`
    border-top: 1px solid ${getColor("grayBlue", "09")};
    padding: 20px;
  `)}
`

export const maxWidthStyle = css`
  width: 100%;
  max-width: 832px;
  padding: 0 16px;
`
