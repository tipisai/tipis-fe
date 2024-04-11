import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { CODE_STATUS } from "../interface"

export const inlineCodeStyle = css`
  display: inline-block;
  margin: 0 4px;
  font-size: 12px;
  border-radius: 4px;
  padding: 0 4px;
  font-weight: 450;
  line-height: 18px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background-color: ${getColor("white", "03")};
`

export const codeBlockContainerStyle = (codeStatus: CODE_STATUS) => {
  let bgColor, borderColor
  switch (codeStatus) {
    default:
    case CODE_STATUS.DEFAULT:
      bgColor = "#fafafa"
      borderColor = getColor("grayBlue", "08")
      break
    case CODE_STATUS.ERROR:
      bgColor = "#FFF9F7"
      borderColor = getColor("red", "07")
      break
  }
  return css`
    background-color: ${bgColor};
    display: flex;
    flex-direction: column;
    align-self: stretch;
    border-radius: 12px;
    margin: 4px 0;
    border: 1px solid ${borderColor};
  `
}

export const codeBlockHeaderStyle = (codeStatus: CODE_STATUS) => {
  let borderColor
  switch (codeStatus) {
    default:
    case CODE_STATUS.DEFAULT:
      borderColor = getColor("grayBlue", "08")
      break
    case CODE_STATUS.ERROR:
      borderColor = getColor("red", "07")
      break
  }
  return css`
    display: flex;
    padding: 4px 16px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    border-bottom: 1px solid ${borderColor};
    color: ${getColor("grayBlue", "02")};
    font-size: 12px;
    font-weight: 400;
  `
}

export const copyStyle = (isReceiving: boolean) => css`
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  color: ${isReceiving
    ? getColor("grayBlue", "04")
    : getColor("grayBlue", "02")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-transform: capitalize;
  cursor: ${isReceiving ? "not-allowed" : "pointer"};
`
