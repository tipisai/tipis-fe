import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const gridFormFieldStyle: SerializedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

export const passwordFormContainerStyle = css`
  display: flex;
  width: 600px;
  justify-content: center;
`

export const formTitleStyle: SerializedStyles = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${getColor("grayBlue", "02")};
  margin-bottom: 16px;
`

export const gridItemStyle: SerializedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const formLabelStyle = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
`

export const innerContainerStyle = css`
  display: flex;
  justify-content: center;
`
