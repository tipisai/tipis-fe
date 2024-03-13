import { SerializedStyles, css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const mobileCardWrapperStyle = css`
  display: flex;
  gap: 32rem;
  margin-bottom: 80rem;
  justify-content: center;
`
export const mobileLinkIconStyle = css`
  width: 48rem;
  height: 48rem;
`

export const mobileLinkTitleStyle = css`
  font-weight: 600;
  font-size: 30rem;
  line-height: 44rem;
  color: ${getColor("grayBlue", "02")};
  margin-bottom: 16rem;
`

export const mobileDescStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 28rem;
  font-style: normal;
  font-weight: 400;
  line-height: 34rem;
`

export const mobileLinkButtonStyle: SerializedStyles = css`
  margin-top: 48rem;
  height: 88rem;
  border-radius: 16rem;

  & > span {
    font-size: 32rem;
  }
`
