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
    width: 716rem;
    border-radius: 16rem;
    margin: 32rem;
  `)}
`

export const decorateStyle = css`
  width: 100%;

  ${applyMobileStyle(css`
    height: 405rem;
  `)}
`

export const headerStyle = css`
  padding: 16px;

  ${applyMobileStyle(css`
    padding: 32rem;
  `)}
`

export const titleStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 8px;

  ${applyMobileStyle(css`
    font-size: 36rem;
    line-height: 44rem;
    margin-bottom: 16rem;
  `)}
`

export const descriptionStyle = css`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${getColor("grayBlue", "03")};

  ${applyMobileStyle(css`
    font-size: 28rem;
    line-height: 34rem;
  `)}
`

export const actionAreaStyle = css`
  width: 100%;
  padding: 16px;
  text-align: center;

  ${applyMobileStyle(css`
    padding: 16px;
  `)}
`
