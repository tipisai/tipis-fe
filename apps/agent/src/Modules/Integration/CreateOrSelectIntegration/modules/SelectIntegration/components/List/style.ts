import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const itemContainerStyle = (isSelected: boolean) => css`
  width: 100%;
  padding: 12px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${isSelected ? getColor("grayBlue", "07") : "transparent"};
  :hover {
    background-color: ${getColor("grayBlue", "07")};
  }
`

export const itemIconAndNameContainerStyle = css`
  flex: none;
  width: 360px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const iconStyle = css`
  width: 24px;
  height: 24px;
  font-size: 24px;
  flex: none;
`

export const itemNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const itemTimeContainerStyle = css`
  display: flex;
  flex: none;
  width: 120px;
  padding: 0px 16px;
  align-items: center;
`
