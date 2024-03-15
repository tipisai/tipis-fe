import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const settingWrapperStyle = css`
  display: flex;
  justify-content: center;
  gap: 64px;
`

export const avatarStyle = css`
  width: 120px;
  height: 120px;
  flex: none;
`

export const editLabelStyle = css`
  margin-top: 8px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${getColor("grayBlue", "02")};
`

export const formStyle = css`
  width: 600px;
`

export const formTitleStyle: SerializedStyles = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${getColor("grayBlue", "02")};
  margin-bottom: 24px;
`

export const gridFormFieldStyle = css`
  display: grid;
  gap: 64px;
  margin-bottom: 40px;
`

export const formLabelStyle = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const leaveLabelStyle = css`
  margin: 64px 0 16px;
  ${formLabelStyle};
`

export const forgotPwdContainerStyle: SerializedStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const gridItemStyle: SerializedStyles = css`
  display: grid;
  gap: 8px;
`
