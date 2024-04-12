import { css } from "@emotion/react"

export const customDrawStyle = css`
  background: linear-gradient(
    180deg,
    #f6effb 0%,
    #f1ebf8 49.5%,
    #efe9f5 100%
  ) !important;
  .ant-drawer-header {
    border-bottom: none;
  }
  .ant-drawer-body {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
`

export const dividerContainerStyle = css`
  width: 100%;
  padding: 0 16px;
`

export const menuContentStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const mobileFirstPageLayoutContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
