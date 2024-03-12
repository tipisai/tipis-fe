import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const userInfoContentContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;
  :hover {
    background: rgba(16, 9, 116, 0.08);
    border-radius: 16px;
  }
`

export const avatarContainerStyle = css`
  flex: none;
`

export const nickNameAndEmailContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`

export const nicknameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const emailStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`
