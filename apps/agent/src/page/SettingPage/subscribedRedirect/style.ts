import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fafafa;
`

export const subscribedContentStyle = css`
  border: unset;
  width: 486px;
  background: ${getColor("white", "01")};
  border: 1px solid ${getColor("grayBlue", "08")};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;

  ${applyMobileStyle(css`
    width: 358px;
    border-radius: 8px;
    margin: 16px;
  `)}
`

export const decorateStyle = css`
  width: 100%;

  ${applyMobileStyle(css`
    height: 200px;
  `)}
`

export const headerStyle = css`
  padding: 16px;
`

export const titleStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 8px;
`

export const descriptionStyle = css`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${getColor("grayBlue", "03")};
`

export const actionAreaStyle = css`
  width: 100%;
  padding: 16px;
  text-align: center;
`
