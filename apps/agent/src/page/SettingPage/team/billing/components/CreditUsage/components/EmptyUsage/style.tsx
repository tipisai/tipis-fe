import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const emptyContainerStyle = css`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${getColor("grayBlue", "09")};
  border-radius: 50%;
`

export const emptyStyle = css`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  background-color: ${getColor("white", "01")};
  align-items: center;
  justify-content: center;
`

export const emptyNumStyle = css`
  color: ${getColor("grayBlue", "02")};
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`

export const emptyUsedStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  text-align: center;
  font-weight: 400;
  line-height: 20px;
`
