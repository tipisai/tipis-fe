import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const navStyle = css`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 6px;
  background: ${getColor("white", "01")};
  z-index: 2;
`

export const wrapperStyle = css`
  font-size: 16px;
  line-height: 22px;
`
export const contentStyle = css`
  height: calc(var(--dvh, 1vh) * 100);
  padding: 68px 0 4px 0;
  font-size: 14px;
  overflow: auto;
`
export const prevIconStyle = css`
  font-size: 20px;
  margin: 10px;
  cursor: pointer;
`

export const applyContentStyle = (withoutPadding?: boolean) => {
  return css`
    ${contentStyle};
    padding: ${withoutPadding ? "68px 0 0" : `68px 16px 4px`};
  `
}

export const mobileTitleStyle = css`
  width: 100%;
  padding: 4px 0 20px 0;
  margin-bottom: 20px;
  color: ${getColor("grayBlue", "02")};
  font-size: 24px;
  font-weight: 600;
`
