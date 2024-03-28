import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const collarUsageContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
`

export const collarUsageHeaderStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

export const cardContainerStyle = css`
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${getColor("grayBlue", "09")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
`

export const doughnutContainerStyle = css`
  width: 200px;
`

export const detailStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

export const loadingContainerStyle = css`
  width: 100%;
  height: 286px;
`
