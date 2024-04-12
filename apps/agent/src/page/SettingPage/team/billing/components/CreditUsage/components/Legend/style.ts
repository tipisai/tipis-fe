import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const legendContainerStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  ${applyMobileStyle(css`
    width: 100%;
    justify-content: center;
    gap: 24px;
  `)}
`

export const legendItemContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`

export const itemContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const itemUnitContainerStyle = css`
  ${itemContainerStyle};
  ${applyMobileStyle(css`
    flex-direction: column;
  `)}
`

export const itemNameStyle = css`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const legendPointStyle = (color: string) => css`
  width: 8px;
  height: 8px;
  background-color: ${color};
  border-radius: 50%;
`

export const itemUsedStyle = css`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  ${applyMobileStyle(css`
    font-size: 14px;
    line-height: 17px;
  `)}
`

export const itemPercentStyle = css`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: ${getColor("grayBlue", "03")};
  ${applyMobileStyle(css`
    line-height: 15px;
  `)}
`
