import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const menuContainerStyle = css`
  width: 256px;
  padding: 16px 0 16px 16px;
  height: 100%;
  flex: none;
`

export const menuInnerContainerStyle = css`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;
  background: linear-gradient(180deg, #f6effb 0%, #f1ebf8 49.5%, #efe9f5 100%);
`

export const menuContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const dividerOuterContainerStyle = css`
  width: 100%;
  padding: 0 16px;
  display: flex;
  gap: 8px;
`

export const dividerInnerContainerStyle = (canResize: boolean) => css`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: ${canResize ? "ns-resize" : "default"};
  :hover {
    .divider {
      ${canResize && activeDividerStyle}
    }
  }
`
export const activeDividerStyle = css`
  background-color: rgba(16, 9, 116, 0.5);
`
export const dividerStyle = css`
  height: 1px;
  width: 100%;
  background-color: rgba(16, 9, 116, 0.08);
  transition: background-color 0.2s;
`

export const teamSelectAndInviteButtonContainerStyle = css`
  width: 100%;
  padding: 8px 16px 8px 24px;
`

export const closeAllContainerStyle = css`
  display: flex;
  align-items: center;
  padding: 1px 8px;
  cursor: pointer;
  flex: none;
  border-radius: 4px;
  :hover {
    span {
      color: ${getColor("grayBlue", "03")};
    }
  }
`

export const closeAllTextStyle = css`
  color: ${getColor("grayBlue", "05")};
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
`

export const tabAreaContainerStyle = (isDragging: boolean) => {
  const isDraggingStyle = css`
    .recent-tabs-area,
    .pined-tipis-area {
      pointer-events: none;
    }
  `
  return css`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    ${isDragging && isDraggingStyle}
  `
}
