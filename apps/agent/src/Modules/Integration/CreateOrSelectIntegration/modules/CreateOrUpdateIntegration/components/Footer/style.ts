import { css } from "@emotion/react"

export const footerContainerStyle = (hasBackButton: boolean) => css`
  width: 100%;
  display: flex;
  align-items: center;

  justify-content: ${hasBackButton ? "space-between" : "flex-end"};
  padding-top: 24px;
`

export const confirmButtonStyle = css`
  width: 200px;
`
