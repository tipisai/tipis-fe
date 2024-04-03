import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const formStyle = css`
  padding: 18px 0;
`

export const gridItemStyle: SerializedStyles = css`
  display: grid;
  gap: 16px;
  position: relative;
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
  gap: 32px;
  margin-bottom: 32px;
`

export const formLabelStyle = css`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: ${getColor("grayBlue", "02")};
`

export const forgotPwdContainerStyle: SerializedStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const mobileSettingContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 48px;
`

export const uploadTeamLogoContainerStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const uploadContentContainerStyle = css`
  color: ${getColor("grayBlue", "04")};

  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  object-position: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  + .ant-image-mask {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
`
