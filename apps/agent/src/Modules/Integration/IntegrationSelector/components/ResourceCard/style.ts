import { css } from "@emotion/react"
import { getColor, globalColor, illaPrefix } from "@illa-public/color-scheme"

export const applyItemStyle = css`
  display: flex;
  padding: 0 0 0 16px;
  height: 56px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  border: solid 1px ${globalColor(`--${illaPrefix}-grayBlue-08`)};
  position: relative;
  background-color: ${globalColor(`--${illaPrefix}-white-01`)};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: ${getColor("grayBlue", "02")};
  &:hover {
    box-shadow: 0 4px 10px 0 ${globalColor(`--${illaPrefix}-blackAlpha-07`)};
    background-color: ${globalColor(`--${illaPrefix}-techPurple-08`)};
    border-color: ${globalColor(`--${illaPrefix}-techPurple-03`)};
    color: ${getColor("grayBlue", "02")};
  }
`

export const nameStyle = css`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: ${getColor("grayBlue", "02")};
  overflow: hidden;
  text-overflow: ellipsis;
`

export const titleContainerStyle = css`
  display: inline-flex;
  flex-direction: column;
  margin-left: 12px;
  overflow: hidden;
  white-space: nowrap;
`

export const subTitleStyle = css`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: ${getColor("grayBlue", "04")};
`

export const iconStyle = css`
  flex: none;
  width: 24px;
  height: 24px;
`
