import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const agentMessageContainer = css`
  padding: 24px 48px 8px 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  flex: none;
  ${applyMobileStyle(css`
    padding: 24px 0 8px 0;
  `)}
`

export const senderContainerStyle = css`
  display: inline-flex;
  align-items: start;
  flex-direction: column;
  max-width: 100%;
  position: relative;
  gap: 8px;
`

export const senderAvatarStyle = css`
  margin-right: 16px;
  flex: none;
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
