import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const gridFormFieldStyle: SerializedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

export const tipTextStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "04")};
`

export const gridItemStyle: SerializedStyles = css`
  display: grid;
  gap: 8px;
`

export const avatarStyle = css`
  width: 120px;
  height: 120px;
  font-size: 50px;
  flex: none;
`

export const editLabelStyle = css`
  margin-top: 8px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${getColor("grayBlue", "04")};
`

export const contentContainerStyle = css`
  display: flex;
  justify-content: center;
  gap: 64px;
`

export const outerContainerStyle = css`
  display: flex;
  justify-content: center;
`

export const formLabelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  line-height: 1;
`

export const formContainerStyle = css`
  width: 600px;
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
