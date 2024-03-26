import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const iconStyle = css`
  width: 16px;
  height: 16px;
`

export const cardStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${getColor("white", "01")};
  cursor: pointer;
`
export const headerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  border-radius: 8px;
  height: 161px;
  overflow: hidden;
  position: relative;
  z-index: 0;
`

export const agentIconStyle = css`
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
`

export const actionContainerStyle = css`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 4px 12px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
`

export const actionStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const actionCountStyle = css`
  display: flex;
  align-items: center;
  color: ${getColor("white", "01")};
  font-size: 12px;
  padding: 1px 0;
  font-weight: 400;
  line-height: 22px;
`

export const cardContentContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`

export const modalInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`

export const modelNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

export const modelLogoStyle = css`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  & svg {
    height: 100%;
    width: 100%;
  }
`

export const textEllipsisStyle = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const nameStyle = css`
  width: 100%;
  color: ${getColor("grayBlue", "02")};
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  ${textEllipsisStyle};
`

export const descriptionStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`
