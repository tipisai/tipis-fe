import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

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

export const operationStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
`

export const sendButtonStyle = css`
  display: flex;
  align-items: center;
  align-items: flex-end;
  gap: 8px;
`
