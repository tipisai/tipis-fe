import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

const basLayoutContainerStyle = css`
  display: flex;
  padding: 8px 0px;
  width: 100%;
`

export const rowLayoutContainerStyle = css`
  ${basLayoutContainerStyle};
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

export const rowLayoutWithExtChildrenNodeOuterContainerStyle = css`
  ${basLayoutContainerStyle};
  justify-content: space-between;
  flex-direction: column;
  gap: 8px;
`

export const rowLayoutWithExtChildrenNodeInnerContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
`

export const rowLayoutExtChildrenNodeContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

export const columnLayoutContainerStyle = css`
  ${basLayoutContainerStyle};
  flex-direction: column;
  gap: 8px;
`

export const labelStyle = css`
  font-size: 14px;
  color: ${getColor("grayBlue", "02")};
  line-height: 22px;
  font-weight: 500;
  white-space: nowrap;
  width: 80px;
  flex: none;
`

export const extLabelStyle = css`
  font-size: 12px;
  color: ${getColor("grayBlue", "03")};
  font-weight: 400;
  line-height: 20px;
`

export const columnLayoutHeaderStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const labelContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
