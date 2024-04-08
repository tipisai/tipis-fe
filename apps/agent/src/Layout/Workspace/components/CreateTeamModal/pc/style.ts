import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import decorateLeft from "@/assets/workspace/decorate-left.svg"
import decorateRight from "@/assets/workspace/decorate-right.svg"

export const modalCloseIconStyle = css`
  position: absolute;
  width: 24px;
  height: 24px;
  line-height: 10px;
  text-align: center;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${getColor("grayBlue", "02")};
`

const decorateStyle = css`
  background-repeat: no-repeat;
  width: 130px;
  height: 251px;
  position: absolute;
  top: 61px;
  pointer-events: none;
`

export const requireStyle = css`
  &::after {
    margin-left: 2px;
    display: inline;
    content: "*";
    font-size: 14px;
    color: rgb(235, 54, 57);
    font-weight: 500;
  }
`

export const modalDecorateLeftStyle = css`
  ${decorateStyle};
  background-image: url(${decorateLeft});
  left: 0;
`

export const modalDecorateRightStyle = css`
  ${decorateStyle};
  width: 678px;
  background-image: url(${decorateRight});
  right: 0;
`

export const formHeaderStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${getColor("grayBlue", "02")};
  margin-bottom: 41px;
`

export const formStyle = css`
  margin: 84px 106px;
  padding: 24px 16px;
  background: ${getColor("white", "01")};
  border: 1px solid ${getColor("grayBlue", "09")};
  border-radius: 8px;
`

export const gridFormFieldStyle: SerializedStyles = css`
  display: grid;
  gap: 16px;
`

export const gridItemStyle: SerializedStyles = css`
  display: grid;
  gap: 9px;
`

export const inviteCodeLabelStyle = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const descriptionStyle = css`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${getColor("grayBlue", "04")};
`

export const tipTextStyle = css`
  white-space: pre;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${getColor("grayBlue", "04")};
`

export const formLabelStyle: SerializedStyles = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: ${getColor("grayBlue", "02")};
`

export const createBgStyle = css`
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: -1;
  left: 0;
  right: 0;
`
