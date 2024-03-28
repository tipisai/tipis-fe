import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const modalBodyCOntainerStyle = css`
  max-height: ${85 * 4}px;
  overflow-y: auto;
`

export const inputAreaContainerStyle = css`
  display: flex;
  padding: 8px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

export const variableNameContainerStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  width: 100%;
`
