import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const landingTitleStyle = css`
  width: 100%;
  padding: 4px 16px 20px 16px;
  color: ${getColor("grayBlue", "02")};
  font-size: 24px;
  font-weight: 600;
`
export const landingMenuItemsStyle = css`
  background-color: #f7f8fa;
  width: 100%;
  height: 12px;
`
export const landingMenuTitleStyle = css`
  display: flex;
  padding: 9px 16px;
  align-items: center;
  gap: 8px;
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const teamSwitchStyle = css`
  .teamSwitchContainer {
    display: flex;
    padding: 9px 16px;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    & > div {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  .teamSwitchIcon {
    margin-right: 0;
    width: 16px;
    height: 16px;
    box-sizing: content-box;
  }
`
