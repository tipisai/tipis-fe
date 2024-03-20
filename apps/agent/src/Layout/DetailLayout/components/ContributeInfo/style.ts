import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const contributeContainerStyle = css`
  display: flex;
  gap: 32px;
  width: 100%;
`

export const teamInfoContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const labelNameStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const teamIconAndNameContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const teamNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`

export const contributeInfoContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`
