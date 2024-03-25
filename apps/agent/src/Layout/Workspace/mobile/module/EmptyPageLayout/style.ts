import { css } from "@emotion/react"

export const customDrawStyle = css`
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
  justify-content: flex-start;
  align-items: center;
  padding-top: 32px;
  gap: 8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`
