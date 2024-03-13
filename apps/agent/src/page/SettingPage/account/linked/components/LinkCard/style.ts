import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { MOBILE_MAX_WIDTH } from "@illa-public/utils"

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const headerContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const titleContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const iconContainerStyle = css`
  flex: none;
  display: flex;
  align-items: center;
  font-size: 24px;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
`

export const descriptionStyle = css`
  display: inline-block;
  padding-left: 40px;
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`

export const buttonWrapperStyle = css`
  display: inline-block;
  padding-left: 40px;
`

export const maskStyle = css`
  @media screen and (max-width: ${MOBILE_MAX_WIDTH}px) {
    padding: 0 20px;
  }
`

export const modalWrapperStyle = css`
  @media screen and (max-width: ${MOBILE_MAX_WIDTH}px) {
    min-width: unset;
    width: unset;
  }
`
