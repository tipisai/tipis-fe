import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 240px;
  padding: 8px 0;
`

export const switchItemStyle = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    background-color: ${getColor("grayBlue", "09")};
  }
`
export const teamInfoStyle = css`
  display: flex;
  color: ${getColor("grayBlue", "02")};
  width: calc(100% - 12px);
  gap: 12px;
  align-items: center;
`
