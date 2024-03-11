import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const formStyle: SerializedStyles = css`
  position: relative;
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
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const formItemContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`

export const descriptionStyle: SerializedStyles = css`
  color: ${getColor("grayBlue", "04")};
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

export const oAuthButtonStyle = css`
  width: 44px;
  height: 44px;
`

export const oAuthIconStyle = css`
  font-size: 16px;
`

export const resetPasswordSubtitleWrapperStyle = css`
  margin-top: 8;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  user-select: none;
`

export const hotspotWrapperStyle = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`

export const prevIconStyle = css`
  width: 12px;
  height: 12px;
  font-size: 12px;
  flex: none;
`
