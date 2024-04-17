import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const userInfoContentContainerStyle = (isMiniSize: boolean) => {
  const basicStyle = css`
    display: flex;
    align-items: center;
    width: 100%;

    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor: pointer;
    gap: 8px;
  `

  const defaultStyle = css`
    ${basicStyle};
    padding: 8px;
    border-radius: 16px;
    :hover {
      background: rgba(16, 9, 116, 0.08);
    }
  `

  const miniStyle = css`
    ${basicStyle};
    padding: 4px;
    justify-content: center;
    border-radius: 8px;
    :hover {
      background: rgba(16, 9, 116, 0.06);
    }
  `

  return isMiniSize ? miniStyle : defaultStyle
}

export const avatarContainerStyle = css`
  flex: none;
`

export const nickNameAndEmailContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`

export const nicknameStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const emailStyle = css`
  color: ${getColor("grayBlue", "03")};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`
