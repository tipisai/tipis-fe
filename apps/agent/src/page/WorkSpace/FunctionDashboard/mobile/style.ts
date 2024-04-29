import { css } from "@emotion/react"

export const tabsContainerStyle = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ant-tabs-nav {
    padding: 0 20px;
  }
  .ant-tabs-content-holder,
  .ant-tabs-content,
  .ant-tabs-tabpane {
    height: 100%;
  }
`

export const functionMobileDashboardContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
