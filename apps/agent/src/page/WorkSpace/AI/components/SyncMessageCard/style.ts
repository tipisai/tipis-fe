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

export const headerContainerStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  background: ${getColor("white", "01")};
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
`

export const infoContainerStyle = css`
  display: flex;
  padding: 9px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 264px;
  overflow: hidden;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
`

export const textAndIconContainerStyle = css`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
`

export const infoTextContainerStyle = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
`

export const infoTitleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const infoDescStyle = (status: MESSAGE_STATUS) => {
  let textColor = getColor("grayBlue", "03")
  switch (status) {
    case MESSAGE_STATUS.ANALYZE_FAILED:
      textColor = getColor("red", "03")
      break
    case MESSAGE_STATUS.ANALYZE_STOP:
      textColor = getColor("grayBlue", "04")
      break
  }
  return css`
    color: ${getColor("grayBlue", "03")};
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${textColor};
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
  font-size: 32px;
`
export const codeRunningStyle = css`
  height: 32px;
  width: 32px;
  background-color: ${getColor("techPurple", "08")};
  border-radius: 50%;
`

export const actionIconStyle = css`
  font-size: 16px;
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

export const lineContainerStyle = css`
  display: flex;
  padding: 0px 28px;
  align-items: flex-start;
  gap: 8px;
`

export const lineStyle = css`
  width: 1px;
  height: 16px;
  background-color: ${getColor("grayBlue", "08")};
`
