import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`

export const fileListContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  width: 100%;
`

export const fileItemStyle = css`
  border-radius: 12px;
  background: ${getColor("grayBlue", "09")};
  display: flex;
  padding: 9px 12px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

export const nameContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const fileTypeIconStyle = css`
  width: 16px;
  height: 20px;
`

export const fileNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  display: inline-block;
  max-width: 364px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`

export const opeationStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const iconHotSpotStyle = css`
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${getColor("grayBlue", "02")};
`
