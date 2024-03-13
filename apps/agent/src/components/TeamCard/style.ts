import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const teamCardContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const cardHeaderContainerStyle = css`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const cardIconAndTitleContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`

export const cardIconContainerStyle = css`
  width: 64px;
  height: 64px;
  flex: none;
`

export const cardTitleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const moreButtonContainerStyle = css`
  flex: none;
  display: flex;
  height: 48px;
`

export const descriptionsStyle = css`
  flex: none;
  width: 100%;
  height: 36px;
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  margin-bottom: 0 !important;
`

export const teamCardFooterContainerStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

export const tagsContainerStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const cardContainerStyle = css`
  :hover {
    border-color: ${getColor("techPurple", "03")};
  }
`

export const footerButtonContainerStyle = css`
  display: flex;
  flex: none;
  gap: 8px;
`
