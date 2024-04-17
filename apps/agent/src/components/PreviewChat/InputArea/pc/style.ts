import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const inputContainerStyle = css`
  width: 100%;
  padding: 16px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  border: 1px solid ${getColor("grayBlue", "09")};
  background: ${getColor("white", "01")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  position: relative;
`

export const uploadDropZoneStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${getColor("white", "04")};
  backdrop-filter: blur(5px);
  border-radius: 24px;
`

export const uploadContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const uploadContentTipStyle = css`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${getColor("grayBlue", "03")};
`

export const presetOptionsContainerStyle = css`
  position: absolute;
  left: 0;
  width: 100%;
  padding: 0 16px;
`
