import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const workspaceLayoutContainerStyle = css`
  display: flex;
  width: 100%;
  height: 100%;
`

export const contentContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
`

export const emptyIconStyle = css`
  width: 80px;
  height: 80px;
  font-size: 80px;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
`
