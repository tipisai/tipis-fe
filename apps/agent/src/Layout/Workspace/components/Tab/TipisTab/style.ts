import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"
import {
  baseMenuItemNameStyle,
  baseMenuItemStyle,
  baseOuterContainerStyle,
} from "../baseTabStyle"

export const menuItemIconContainerStyle = css`
  font-size: 16px;
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #dad5eb;
  padding: 4px;
`

export const chatIconStyle = css`
  width: 24px;
  height: 24px;
  font-size: 24px;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
`

export const menuItemStyle = (isSelected: boolean) => {
  const menuItemInnerContainerStyle = isSelected
    ? css`
        .menu-item-inner-container {
          background-color: ${getColor("white", "02")};
          box-shadow: 0px 2px 4px 0px rgba(38, 20, 33, 0.08);
        }
      `
    : css`
        :hover {
          .menu-item-inner-container {
            background-color: rgba(16, 9, 116, 0.06);
          }
        }
      `

  return css`
    ${baseMenuItemStyle}
    ${menuItemInnerContainerStyle}
  `
}

export const menuItemNameStyle = (isActive: boolean) => css`
  ${baseMenuItemNameStyle}
  font-weight: ${isActive ? "600" : "500"};
`

export const navLinkStyle = (isMiniSize: boolean) => css`
  ${baseOuterContainerStyle(isMiniSize)};

  :-webkit-any-link {
    text-decoration: none;
    color: inherit;
    &:active {
      color: inherit;
    }
  }
  @keyframes grow-x {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  @keyframes shrink-x {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  ::view-transition-old(figure-caption),
  ::view-transition-new(figure-caption) {
    height: auto;
    right: 0;
    left: auto;
    transform-origin: right center;
  }

  ::view-transition-old(figure-caption) {
    animation: 0.25s linear both shrink-x;
  }

  ::view-transition-new(figure-caption) {
    animation: 0.25s 0.25s linear both grow-x;
  }
`
