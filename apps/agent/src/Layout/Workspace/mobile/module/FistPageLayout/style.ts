import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

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

export const dividerOuterContainerStyle = css`
  width: 100%;
  padding: 0 16px;
  display: flex;
  gap: 8px;
`

export const dividerInnerContainerStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px 0;
`
export const activeDividerStyle = css`
  background-color: rgba(16, 9, 116, 0.5);
`
export const dividerStyle = css`
  height: 1px;
  width: 100%;
  background-color: rgba(16, 9, 116, 0.08);
  transition: background-color 0.2s;
  :hover {
    ${activeDividerStyle}
  }
`

export const closeAllContainerStyle = css`
  display: flex;
  align-items: center;
  padding: 1px 8px;
  cursor: pointer;
  flex: none;
  border-radius: 4px;
  :hover {
    span {
      color: ${getColor("grayBlue", "03")};
    }
  }
`

export const closeAllTextStyle = css`
  color: ${getColor("grayBlue", "05")};
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
`
