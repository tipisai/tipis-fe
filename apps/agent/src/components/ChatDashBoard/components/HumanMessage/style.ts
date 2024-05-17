import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const messageContainer = css`
  padding: 24px 0 8px 48px;
  display: flex;
  justify-content: end;
  width: 100%;
  overflow: hidden;
  flex: none;
  flex-direction: row;
  ${applyMobileStyle(css`
    padding: 24px 0 8px 0;
  `)}
`

export const senderContainerStyle = css`
  display: inline-flex;
  overflow-x: hidden;
  flex-direction: column;
  align-items: end;
  gap: 8px;
  max-width: 100%;
  width: 100%;
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
  max-width: 100%;
  overflow-x: hidden;
  ${applyMobileStyle(css`
    margin-left: 0;
  `)}
`

export const markdownHoverCopyStyle = css`
  display: inline-flex;
  padding: 4px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background: ${getColor("white", "01")};
  cursor: pointer;
  color: ${getColor("grayBlue", "02")};
  transform: translateX(4px);
`
