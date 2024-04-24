import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const descContainerStyle = css`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`

export const descTextStyle = css`
  margin-left: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  background: linear-gradient(90deg, #853dff 0%, #e13eff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const integrationContainerStyle = css`
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${getColor("grayBlue", "08")};
  cursor: pointer;
  :hover {
    background-color: ${getColor("grayBlue", "07")};
  }
`

export const integrationNameAndIconStyle = css`
  display: flex;
  gap: 8px;
  width: 100%;
`

export const integrationIconStyle = css`
  width: 24px;
  height: 24px;
  font-size: 24px;
  flex: none;
`

export const integrationNameStyle = css`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`
