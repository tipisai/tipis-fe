import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const agentMessageContainer = css`
  padding: 24px 24px 8px 72px;
  display: flex;
  justify-content: end;
  width: 100%;
  overflow: hidden;
  flex: none;
  flex-direction: row;
  ${applyMobileStyle(css`
    padding: 24px 12px 8px 12px;
  `)}
`

export const senderContainerStyle = css`
  display: inline-flex;
  overflow-x: hidden;
  flex-direction: column;
  align-items: end;
  gap: 4px;
  max-width: 100%;
`

export const senderNicknameStyle = css`
  color: ${getColor("grayBlue", "02")};
  max-width: 100%;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`

export const senderAvatarStyle = css`
  margin-left: 16px;
`

export const messageContainerStyle = css`
  border-radius: 16px;
  background: ${getColor("techPurple", "08")};
  padding: 8px 12px;
  ${applyMobileStyle(css`
    margin-left: 0;
  `)}
`
