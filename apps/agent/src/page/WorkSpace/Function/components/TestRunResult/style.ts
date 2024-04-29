import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const runResultContainerStyle = (openDrawer: boolean) => css`
  padding: 0 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  pointer-events: ${openDrawer ? "auto" : "none"};
  .ant-drawer-content-wrapper {
    padding: 0 24px;
    box-shadow: none;
  }
  .ant-drawer-content {
    border-radius: 12px 12px 0 0;
    border: 1px solid ${getColor("grayBlue", "08")};
    box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.16);
  }
  .ant-drawer-body {
    padding: 0;
  }
  .cm-gutters {
    border-radius: 0 !important;
  }
  & .cm-editor {
    border-radius: 0 !important;
    border: none !important;
  }
`

export const extraInfoContainerStyle = css`
  display: flex;
  gap: 24px;
`

export const labelAndValueContainerStyle = css`
  display: flex;
  gap: 4px;
`

export const labelStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`

export const statusStyle = (isError: boolean) => css`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: ${getColor("grayBlue", "02")};
  color: ${isError ? getColor("red", "03") : getColor("green", "03")};
`
