import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const knowledgeContainerStyle = css`
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
`

export const labelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`

export const tagContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`