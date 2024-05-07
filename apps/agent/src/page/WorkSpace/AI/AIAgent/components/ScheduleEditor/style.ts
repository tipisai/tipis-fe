import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const scheduleContainerStyle = (enabled: boolean) => css`
  display: flex;
  padding: 8px 0px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid
    ${enabled ? getColor("grayBlue", "08") : getColor("grayBlue", "09")};
`

export const scheduleInputsContainerStyle = css`
  padding-bottom: 16px;
`
