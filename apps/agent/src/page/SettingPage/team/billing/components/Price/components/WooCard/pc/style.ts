import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
`

export const titleStyle = css`
  align-self: flex-start;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  background: linear-gradient(90deg, #9037ff 0%, #f524ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

export const radioContainerStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`

export const labelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-transform: capitalize;
`

export const cardContainerStyle = css`
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "09")};
  background: ${getColor("white", "01")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
`

export const bgStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`
export const cardHeaderStyle = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
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

export const upgradeButtonStyle = css`
  min-width: 208px;
  padding: 9px 32px;
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
  gap: 8px;
`
export const cardItemLabelStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

export const cardItemDescStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`
