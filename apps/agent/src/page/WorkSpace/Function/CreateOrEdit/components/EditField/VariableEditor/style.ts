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

export const tipisOuterContainerStyle = css`
  width: 100%;
  padding: 8px 0;
`

export const tipisContainerStyle = css`
  width: 100%;
  padding: 16px;
  border: 1px solid ${getColor("grayBlue", "08")};
  background-color: #fafafa;
  border-radius: 12px;
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`
