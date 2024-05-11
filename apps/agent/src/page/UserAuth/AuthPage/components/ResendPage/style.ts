import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const resendPageContainerStyle = css`
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 80%;
`

export const logoStyle = css`
  height: 32px;
  width: auto;
`

export const infoContainerStyle = css`
  display: flex;
  padding: 0px 24px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`

export const titleStyle = css`
  color: ${getColor("grayBlue", "02")};
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`

export const descStyle = css`
  color: ${getColor("grayBlue", "03")};
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`

export const actionContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`
