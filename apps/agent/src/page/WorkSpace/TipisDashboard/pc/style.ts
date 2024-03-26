import { css } from "@emotion/react"

export const tabsContainerStyle = css`
  width: 100%;
  height: 100%;
  padding: 0 24px;
  overflow: hidden;
`

export const tipisPCDashboardContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  & .ant-tabs-content,
  & .ant-tabs-tabpane-active {
    height: 100%;
  }
`
