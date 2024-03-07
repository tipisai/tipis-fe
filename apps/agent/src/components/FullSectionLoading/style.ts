import { css, keyframes } from "@emotion/react"

export const fullSectionStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const rotateKeyframe = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg)
  }
`

export const rotateAnimation = css`
  animation: 1s linear infinite ${rotateKeyframe};
`
