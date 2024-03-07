import { css, keyframes } from "@emotion/react"

export const fullPageLoadingWrapperStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`

export const maskStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0.7;
  background-color: white;
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
