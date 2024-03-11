import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const formStyle: SerializedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`

export const itemContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`

export const formItemStyle = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`

export const formTitleStyle: SerializedStyles = css`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`
export const formLabelStyle: SerializedStyles = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const forgotPwdStyle: SerializedStyles = css`
  font-size: 12px;
  line-height: 20px;
  margin-right: 8px;
`

export const forgotPwdContainerStyle: SerializedStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const descriptionStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "04")};
`

export const oauthContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const oAuthButtonGroupStyle = css`
  width: 100%;
  display: flex;
  gap: 18px;
`

export const oAuthIconStyle = css`
  width: 16px;
  height: 16px;
  margin-right: 6px;
`
