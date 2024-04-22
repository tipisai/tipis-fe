import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const editPanelContainerStyle = css`
  min-width: 480px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const basicContainerStyle = css`
  width: 100%;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const dividerStyle = css`
  height: 1px;
  width: 100%;
  background-color: ${getColor("grayBlue", "08")};
`

export const tipisOuterContainerStyle = css`
  width: 100%;
  padding: 8px 0;
`

export const tipisContainerStyle = css`
  width: 100%;
  padding: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background-color: #fafafa;
  border-radius: 12px;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`
