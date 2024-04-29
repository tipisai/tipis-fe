import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const variableListContainerStyle = css`
  padding: 8px 0;
  display: flex;
  gap: 16px;
  width: 100%;
  flex-direction: column;
`

export const listItemContainerStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 7px 16px;
  border-radius: 12px;
  border: 1px solid ${getColor("grayBlue", "08")};
  width: 100%;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: ${getColor("grayBlue", "09")};
  }
`

export const buttonGroupStyle = css`
  flex: none;
  display: flex;
  gap: 8px;
`

export const buttonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const variableNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
