import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const licenseCardContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${applyMobileStyle(css`
    padding: 0 24px;
  `)}
`

export const teamInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  img {
    width: 40px;
    border-radius: 50%;
  }
  ${applyMobileStyle(css`
    display: none;
  `)}
`

export const cardDetailContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
  ${applyMobileStyle(css`
    flex-direction: column;
    gap: 20px;
  `)}
`

export const cardStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "09")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  ${applyMobileStyle(css`
    gap: 20px;
  `)}
`

export const cardTitleStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const cardNameStyle = css`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`

export const collarCardNameStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  ${cardNameStyle};
`

export const payInfoStyle = css`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${getColor("techPurple", "03")};
  ${applyMobileStyle(css`
    line-height: 15px;
  `)}
`

export const payInfoStatusStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  padding: 0 8px;
  border-radius: 4px;
`

export const payInfoCancelStyle = css`
  ${payInfoStatusStyle};
  background-color: ${getColor("grayBlue", "09")};
  color: ${getColor("grayBlue", "02")};
`

export const payInfoExpiredStyle = css`
  ${payInfoStatusStyle};
  background-color: ${getColor("red", "07")};
  color: ${getColor("red", "03")};
`

export const cardPayDetailStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 64px;
  ${applyMobileStyle(css`
    gap: 32px;
    flex-wrap: wrap;
  `)}
`

export const cardPayDetailItemStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  ${applyMobileStyle(css`
    gap: 2px;
    width: 50%;
    flex: 1;
  `)}
`

export const bonusStyle = css`
  ${cardPayDetailItemStyle};
  ${applyMobileStyle(css`
    width: 100%;
    flex: none;
  `)}
`

export const cardPayDetailNameStyle = css`
  font-size: 12px;
  font-weight: 400px;
  line-height: 20px;
  ${applyMobileStyle(css`
    font-size: 14px;
    line-height: 22px;
    color: ${getColor("grayBlue", "04")};
  `)}
`

export const collarCardPayDetailNameStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  ${cardPayDetailNameStyle};
`

export const doubtColorStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 16px;
`

export const cardPayDetailNumStyle = css`
  font-size: 14px;
  font-weight: 500px;
  line-height: 22px;
  ${applyMobileStyle(css`
    font-size: 14px;
    line-height: 22px;
  `)}
`

export const cardManageButtonStyle = css`
  padding: 5px 16px;
  ${applyMobileStyle(css`
    padding: 9px 16px;
  `)}
`
