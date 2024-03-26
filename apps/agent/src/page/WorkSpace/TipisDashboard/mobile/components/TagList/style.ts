import { css } from "@emotion/react"

export const containerStyle = (
  isEmptyRecommend?: boolean,
  isCardTag?: boolean,
) => css`
  width: 100%;
  display: flex;
  flex: none;
  overflow-x: auto;
  padding: ${isCardTag ? 0 : "0 20px"};
  gap: 8px;
  flex-wrap: ${isEmptyRecommend || isCardTag ? "wrap" : "nowrap"};
  justify-content: ${isEmptyRecommend ? "center" : "flex-start"};
`
