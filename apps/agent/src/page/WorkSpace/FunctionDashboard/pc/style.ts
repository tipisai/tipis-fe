import { css } from "@emotion/react"

export const tabsContainerStyle = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const functionPCDashboardContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  & .ant-tabs-nav-wrap {
    padding: 0 24px;
  }
  & .ant-tabs-content,
  & .ant-tabs-tabpane-active {
    height: 100%;
  }
`

export const cardListContainerStyle = css`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 24px;
`
