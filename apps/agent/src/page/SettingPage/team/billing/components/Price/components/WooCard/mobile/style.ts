import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
  padding: 0 24px;
`

export const titleStyle = css`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`

export const cardContainerStyle = css`
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "09")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 0;
  overflow: hidden;
`

export const priceStyle = css`
  color: ${getColor("grayBlue", "02")};
  display: flex;
  align-items: flex-end;
`

export const priceNumStyle = css`
  text-align: center;
  font-size: 40px;
  font-weight: 700;
  line-height: 120%;
`

export const priceUnitStyle = css`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`

export const cardContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
`

export const cardItemContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`
export const cardItemLabelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`

export const cardItemDescStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const upgradeButtonStyle = css`
  width: 100%;
  padding: 10px 32px;
`

export const bgStyle = css`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  object-position: top;
  z-index: -1;
`
