import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const variableNameContainerStyle = css`
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
`

export const addColumnContainerStyle = css`
  width: 32px;
  display: flex;
  flex-direction: column;
  flex: none;
`

export const listItemContainerStyle = (level: number = 0) => css`
  width: 100%;
  padding: 5px 0;
  overflow: hidden;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: ${level * 16}px;
`

export const variableNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const variableNameAndAddColumnStyle = css`
  width: 100%;
  display: flex;
  overflow: hidden;
`

export const placeholderStyle = css`
  height: 32px;
`
