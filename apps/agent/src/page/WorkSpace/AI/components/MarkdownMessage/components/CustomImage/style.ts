import { css } from "@emotion/react"

export const imageContainerStyle = css`
  position: relative;
  width: 100%;
  margin: 8px 0;
`

export const downloadIconStyle = css`
  font-size: 14px;
`

export const imageStyle = (isExpired: boolean) => {
  if (isExpired) {
    return {
      width: "120px",
      height: "120px",
      borderRadius: "8px",
    }
  } else {
    return {
      width: "100%",
      minWidth: "120px",
      minHeight: "120px",
      borderRadius: "12px",
    }
  }
}
