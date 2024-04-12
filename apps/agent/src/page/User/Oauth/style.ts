import { css } from "@emotion/react"

export const centerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const pageStyle = css`
  ${centerStyle};
  gap: 16px;
  font-weight: 600;
  font-size: 16px;
`

export const mobilePageStyle = css`
  ${centerStyle};
  gap: 16px;
  font-weight: 600;
  font-size: 16px;
`
