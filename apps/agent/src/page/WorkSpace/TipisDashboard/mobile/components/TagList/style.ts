import { css } from "@emotion/react"

export const containerStyle = (isEmptyRecommend?: boolean) => css`
  width: 100vw;
  display: flex;
  flex: none;
  overflow-x: auto;
  padding: 0 20px;
  gap: 8px;
  flex-wrap: ${isEmptyRecommend ? "wrap" : "nowrap"};
  justify-content: ${isEmptyRecommend ? "center" : "flex-start"};
`
