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

export const fileNameStyle = css`
  font-size: 12px;
  display: block;
  max-width: 150px;
  color: ${getColor("grayBlue", "02")};
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: none;
`

export const fileTypeIconStyle = css`
  height: 16px;
  margin-right: 4px;
  flex: none;
`
