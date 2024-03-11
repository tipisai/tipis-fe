import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import mobileUserBg from "@/assets/user/mobileUserBg.svg"

export const layoutStyle = css`
  background: url(${mobileUserBg}) ${getColor("white", "01")} no-repeat;
  background-size: contain;
  padding: 122px 16px 50px;
`

export const contentStyle = css`
  height: 557px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: ${getColor("white", "01")};
  padding: 32px 20px 20px;
  font-size: 14px;
`

export const policyStyle = css`
  margin-top: 40px;
  font-size: 12px;
  color: ${getColor("grayBlue", "03")};
`
