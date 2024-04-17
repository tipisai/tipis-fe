import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const fileCardContainerStyle = css`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 4px;
  border-radius: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background: #fafbfc;
`

export const fileTypeIconStyle = css`
  width: 24px;
  height: 30px;
`

export const fileNameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  flex: 1;
`

export const fileInfoStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 168px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const errorInfoStyle = css`
  color: ${getColor("red", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`
