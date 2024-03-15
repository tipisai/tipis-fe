import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const descriptionStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "04")};
  font-weight: 400;
  line-height: 22px;
  margin: 0;
`

export const applyCodeMirrorWrapperStyle = css`
  width: 100%;
  height: 100%;
`

export const saveButtonStyle = css`
  position: absolute;
  right: 16px;
`

export const contentWrapperStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
