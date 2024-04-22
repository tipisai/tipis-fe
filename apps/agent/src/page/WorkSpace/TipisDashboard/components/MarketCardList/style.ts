import { css } from "@emotion/react"
import { applyMobileStyle } from "@illa-public/utils"

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`

export const listContainerStyle = css`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0 24px 24px 32px;
  ${applyMobileStyle(css`
    padding: 0 20px;
  `)}
`

export const moreLoadingStyle = css`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`
