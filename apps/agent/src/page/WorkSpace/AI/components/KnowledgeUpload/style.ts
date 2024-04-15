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
  width: 100%;
`

export const nameContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  width: 100%;
`

export const fileTypeIconStyle = css`
  width: 16px;
  height: 20px;
`

export const fileNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  display: inline-block;
  width: 100%;
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

export const uploadAreaContainerStyle = (isHovered: boolean) => css`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background-color: ${isHovered
    ? getColor("grayBlue", "09")
    : getColor("white", "01")};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  cursor: pointer;
  :hover {
    background-color: ${getColor("grayBlue", "09")};
  }
`

export const uploadContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const uploadTipiStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  line-height: 22px;
`
