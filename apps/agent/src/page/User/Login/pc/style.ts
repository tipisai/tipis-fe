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

export const formItemStyle = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`

export const formTitleStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

export const formLabelStyle: SerializedStyles = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const forgotPwdContainerStyle: SerializedStyles = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const forgotPwdHeaderStyle = css``

export const descriptionStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "03")};
  font-family: "Helvetica Neue";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
`

export const itemContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
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
  font-size: 16px;
  margin-right: 6px;
`
