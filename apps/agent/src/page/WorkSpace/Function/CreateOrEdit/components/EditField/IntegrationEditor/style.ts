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

export const outerIntegrationContainerStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
`

export const integrationContainerStyle = css`
  width: calc(100% - 42px);
  padding: 7px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 0px 0px 12px;
  border: 1px solid ${getColor("grayBlue", "08")};
  cursor: pointer;
  :hover {
    background-color: ${getColor("grayBlue", "07")};
  }
`

export const downIconContainerStyle = css`
  width: 24px;
  height: 24px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const buttonStyle = css`
  cursor: pointer;
  flex: none;
  padding: 7px;
  border-radius: 0px 12px 12px 0px;
  border: 1px solid ${getColor("grayBlue", "08")};
  margin: -1px;
  :hover {
    background-color: ${getColor("grayBlue", "07")};
  }
`

export const iconContainerStyle = css`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    flex: none;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  max-width: calc(100% - 100px);
`
