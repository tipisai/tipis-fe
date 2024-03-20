import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import { applyMobileStyle } from "@illa-public/utils"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"

export const containerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`

export const headerContainerStyle = (status: MESSAGE_STATUS) => {
  let textColor = getColor("techPurple", "03")
  switch (status) {
    case MESSAGE_STATUS.ANALYZE_ERROR:
      textColor = getColor("red", "03")
      break
    case MESSAGE_STATUS.ANALYZE_SUCCESS:
      textColor = getColor("grayBlue", "02")
      break
    case MESSAGE_STATUS.ANALYZE_STOP:
      textColor = getColor("grayBlue", "04")
      break
    default:
    case MESSAGE_STATUS.ANALYZE_PENDING:
      textColor = getColor("techPurple", "03")
      break
  }
  return css`
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 8px;
    border-radius: 16px;
    background: ${getColor("white", "01")};
    color: ${textColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    cursor: pointer;
  `
}

export const messageContainerStyle = css`
  border-radius: 8px;
  background: ${getColor("grayBlue", "09")};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
  ${applyMobileStyle(css`
    margin-right: 0;
  `)}
`

export const infoIconStyle = css`
  font-size: 24px;
`

export const hoverCopyStyle = css`
  display: inline-flex;
  padding: 4px;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background: ${getColor("white", "01")};
  cursor: pointer;
  color: ${getColor("grayBlue", "02")};
  position: absolute;
  bottom: 0;
  right: -32px;
`
