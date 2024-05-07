import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const scheduleContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`

export const labelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
`

export const scheduleItemContainerStyle = css`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`

export const scheduleItemStyle = css`
  display: flex;
  height: 40px;
  padding: 9px 16px;
  align-items: center;
  gap: 8px;
  border-radius: 20px;
  border: 1px solid ${getColor("grayBlue", "08")};
`

export const timeIconStyle = css`
  font-size: 16px;
`

export const scheduleTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`
