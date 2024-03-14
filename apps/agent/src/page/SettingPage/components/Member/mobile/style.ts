import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const mobileMemberContainerStyle = css`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 88px;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
`

export const mobileTitleStyle = css`
  padding-bottom: 20px;
  font-weight: 600;
  margin: 0;
  color: ${getColor("grayBlue", "02")};
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  align-self: flex-start;
`
