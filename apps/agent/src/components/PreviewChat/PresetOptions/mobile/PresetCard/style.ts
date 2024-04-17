import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const presetCardContainerStyle = css`
  display: flex;
  width: 200px;
  flex: none;
  padding: 12px;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background-color: ${getColor("white", "01")};
  transition: background-color 200ms ease-in-out;
  cursor: pointer;
`

export const cardContentContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
`

export const cardTitleStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const cardDescStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
