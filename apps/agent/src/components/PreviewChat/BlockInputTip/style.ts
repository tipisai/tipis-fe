import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"

export const blockInputContainerStyle = css`
  height: 134px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${getColor("white", "05")};
  backdrop-filter: blur(5px);
  padding: 16px 24px 24px 24px;
  border-radius: 24px;
  border: 1px solid ${getColor("grayBlue", "09")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  ${applyMobileStyle(css`
    height: 100%;
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: unset;
  `)}
`

export const blockInputTextStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-top: 4px;
  line-height: 22px;
`
