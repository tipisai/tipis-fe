import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const listItemContainerStyle = css`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const listAvatarAndNameContainerStyle = css`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
`

export const nickNameAndEmailContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const nickNameContainerStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  overflow: hidden;
  width: 100%;
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const statusStyle = css`
  color: ${getColor("grayBlue", "04")};
  font-size: 14px;
  line-height: 22px;
`

export const emailStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  line-height: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const listRoleSelectStyle = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`
