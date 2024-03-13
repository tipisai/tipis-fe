import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const linkCardWrapperStyle = css`
  display: flex;
  gap: 16px;
  margin-bottom: 64px;
  justify-content: center;
`

export const linkIconStyle = css`
  width: 24px;
  height: 24px;
`

export const linkTitleStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${getColor("grayBlue", "02")};
  margin-bottom: 8px;
`

export const containerStyle = css`
  width: 100%;
  height: 100%;
`

export const cardContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`
