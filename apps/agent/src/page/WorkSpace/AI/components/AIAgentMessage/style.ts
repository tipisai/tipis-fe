import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const agentMessageContainer = (isResult: boolean) => css`
  padding: ${isResult ? "0 88px 8px 40px" : "24px 88px 8px 40px"};
  display: flex;
  flex-direction: row;
  width: 100%;
  ${applyMobileStyle(css`
    padding: 24px 48px 8px 12px;
  `)}
`

export const senderContainerStyle = css`
  display: inline-flex;
  align-items: start;
  flex-direction: column;
  max-width: 100%;
  position: relative;
`

export const senderAvatarStyle = (canShowUserAvatar: boolean) => css`
  margin-right: 16px;
  visibility: ${canShowUserAvatar ? "visible" : "hidden"};
`

export const senderNicknameStyle = css`
  color: ${getColor("grayBlue", "02")};
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  max-width: 100%;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`
