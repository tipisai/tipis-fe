import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const teamSelectContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
`

export const teamNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const teamAvatarContainerStyle = css`
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const iconContainerStyle = css`
  flex: none;
`
