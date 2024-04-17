import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const containerStyle = css`
  gap: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-wrap: wrap;
  ${applyMobileStyle(css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  `)}
`

export const fileItemStyle = css`
  display: flex;
  width: 264px;
  padding: 8px 16px;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 16px;
  background: ${getColor("grayBlue", "09")};
  ${applyMobileStyle(css`
    width: 100%;
  `)}
`

export const iconContainerStyle = css`
  display: flex;
  width: 32px;
  height: 32px;
  padding: 1px 4px;
  justify-content: center;
  align-items: center;
`

export const fileTypeIconStyle = css`
  width: 24px;
  height: 30px;
`

export const fileNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const fileInfoStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 168px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const errorInfoStyle = css`
  color: ${getColor("red", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`
