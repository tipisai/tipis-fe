import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const descContainerStyle = css`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`

export const descTextStyle = css`
  margin-left: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  background: linear-gradient(90deg, #853dff 0%, #e13eff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const uploadContentContainerStyle = css`
  color: ${getColor("grayBlue", "04")};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`

export const uploadPreviewContainerStyle = css`
  width: 100%;
`
