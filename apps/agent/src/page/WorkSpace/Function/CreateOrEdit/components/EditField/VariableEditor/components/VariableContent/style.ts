import { css } from "@emotion/react"

export const variableContentStyle = css`
  width: 100%;
  max-height: 536px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`

export const customModalStyle = css`
  .ant-modal-title {
    text-align: center;
  }
`

export const footerContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
`

export const buttonStyle = css`
  width: 200px;
`
