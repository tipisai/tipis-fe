import { css } from "@emotion/react"

export const containerStyle = (isEmptyRecommend?: boolean) => css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: ${isEmptyRecommend ? "center" : "flex-start"};
  gap: 8px;
`
