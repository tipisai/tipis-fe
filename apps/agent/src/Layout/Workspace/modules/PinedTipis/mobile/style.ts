import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const pinedTipisAreaStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const headerStyle = css`
  width: 100%;
  padding: 8px 24px 0px 24px;
  display: flex;
  align-items: center;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`

export const listContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 300 px;
  overflow-y: auto;
`
