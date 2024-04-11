import { css } from "@emotion/react"

export const lottieItemStyle = (size?: number) => css`
  width: ${size ? `${size}px` : "100%"};
  height: ${size ? `${size}px` : "100%"};
`
