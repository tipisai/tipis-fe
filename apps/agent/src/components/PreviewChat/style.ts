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
export const previewChatContainerStyle = css`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 16px;
`

export const inputTextContainerStyle = css`
  position: relative;
  background-color: ${getColor("white", "01")};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: none;
  ${applyMobileStyle(css`
    border-top: 1px solid ${getColor("grayBlue", "09")};
    padding: 20px;
  `)}
`

export const chatContainerStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 110px;
  width: 100%;
`

export const inputContainerStyle = css`
  width: 100%;
  padding: 16px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  border: 1px solid ${getColor("grayBlue", "09")};
  background: ${getColor("white", "01")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  position: relative;
`

export const inputStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  outline: none;
  line-height: 22px;
  border: none;
  width: 100%;
  font-family: unset;
  background: none;
  resize: none;

  ::placeholder {
    color: ${getColor("grayBlue", "04")};
  }

  &:focus-within {
    outline: none;
    border: none;
    background: none;
  }

  &:active {
    outline: none;
    border: none;
    background: none;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${getColor("grayBlue", "05")};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`

export const generatingContainerStyle = css`
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
  left: 0;
  top: -32px;
  position: absolute;
`

export const generatingContentContainerStyle = css`
  display: inline-flex;
  pointer-events: auto;
  flex-direction: row;
  align-items: center;
  background: ${getColor("white", "01")};
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  padding: 4px 15px;
`
export const generatingTextStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`

export const generatingDividerStyle = css`
  width: 1px;
  height: 12px;
  margin-left: 10px;
  margin-right: 10px;
  background: ${getColor("grayBlue", "08")};
`

export const stopIconStyle = css`
  cursor: pointer;
`

export const operationStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
`

export const sendButtonStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const uploadDropZoneStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${getColor("white", "04")};
  backdrop-filter: blur(5px);
  border-radius: 24px;
`

export const uploadContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const uploadContentTipStyle = css`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${getColor("grayBlue", "03")};
`

export const maxWidthStyle = css`
  width: 100%;
  max-width: 800px;
`
