import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const tagContainer = css`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 8px;
`

export const tagInputContainerStyle = css`
  display: flex;
  flex-direction: row;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`

export const recommendLabelStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`
