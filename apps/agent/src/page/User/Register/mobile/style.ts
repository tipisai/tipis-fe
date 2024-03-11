import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const formStyle: SerializedStyles = css`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`
export const headerStyle: SerializedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const formTitleStyle: SerializedStyles = css`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const descriptionStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "04")};
`

export const formItemContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`

export const forgotPwdStyle: SerializedStyles = css`
  text-align: end;
  font-size: 12px;
  line-height: 20px;
  padding-right: 8px;
  margin-top: 18px;
`

export const oAuthButtonGroupStyle = css`
  width: 100%;
  display: flex;
  gap: 32px;
  justify-content: center;
  margin: auto 0 0;
`

export const oAuthIconStyle = css`
  font-size: 16px;
`
