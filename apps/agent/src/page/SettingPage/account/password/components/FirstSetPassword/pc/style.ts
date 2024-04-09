import { SerializedStyles, css } from "@emotion/react"

export const gridFormFieldStyle: SerializedStyles = css`
  display: inline-flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
`

export const gridItemStyle: SerializedStyles = css`
  display: grid;
  gap: 8px;
`
export const formLabelStyle = css`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
`

export const innerContainerStyle = css`
  display: flex;
  justify-content: center;
`

export const formContainerStyle = css`
  display: flex;
  width: 600px;
  gap: 40px;
  flex-direction: column;
`
