import { css } from "@emotion/react"

export const mobileModalStyle = css`
  width: 653rem;
  min-width: 653rem;
  border-radius: 16rem;

  & > div {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      padding: 48rem 32rem;
    }
  }
`

export const mobileModalTitleStyle = css`
  margin: 48rem 48rem 0;
  font-weight: 500;
  font-size: 32rem;
  line-height: 48rem;
  text-align: start;
`

export const mobileModalContentStyle = css`
  margin: 32rem 48rem;
  font-weight: 400;
  font-size: 28rem;
  line-height: 44rem;
`

export const mobileModalButtonStyle = css`
  padding: 10rem 32rem;
  & > span {
    font-size: 28rem;
  }
`

export const descStyle = css`
  margin-bottom: 16px;
`
