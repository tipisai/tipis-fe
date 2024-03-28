import { css } from "@emotion/react"

export const menuContainerStyle = css`
  width: 256px;
  padding: 16px 0 16px 16px;
  height: 100%;
  flex: none;
`

export const menuInnerContainerStyle = css`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;
  background: linear-gradient(180deg, #f6effb 0%, #f1ebf8 49.5%, #efe9f5 100%);
`

export const menuContentStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const dividerContainerStyle = css`
  width: 100%;
  padding: 0 16px;
`
