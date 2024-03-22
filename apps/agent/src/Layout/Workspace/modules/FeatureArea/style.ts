import { css } from "@emotion/react"

export const featureAreaContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const featureAreaPublicPadding = css`
  padding: 4px 15px;
`

export const featureCardsContainerStyle = css`
  ${featureAreaPublicPadding};
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const publicMenuItemFeatureContainerStyle = css`
  width: 100%;
  ${featureAreaPublicPadding};
`
