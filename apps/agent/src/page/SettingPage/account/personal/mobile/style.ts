import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const tipTextStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "04")};
`

export const avatarContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const cameraIconContainerStyle = css`
  border-radius: 50%;
  padding: 4px;
  background-color: ${getColor("grayBlue", "09")};
  font-size: 16px;
  position: absolute;
  bottom: 0;
  right: 0;
`

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 48px;
`

export const formLabelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
`

export const controllerContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`

export const formContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
`
