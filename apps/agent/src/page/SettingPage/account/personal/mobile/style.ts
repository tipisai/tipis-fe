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

export const uploadContentContainerStyle = css`
  color: ${getColor("grayBlue", "04")};
  height: 100%;
  width: 100%;
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  object-position: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  + .ant-image-mask {
    border-radius: 50%;
    inset: 1px;
  }
`
