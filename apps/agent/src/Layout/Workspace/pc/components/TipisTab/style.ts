import { css } from "@emotion/react"
import { getColor } from "@illa-public/color-scheme"

export const menuItemButtonStyle = (isSelected: boolean) => {
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
    display: block;
    padding: 4px 16px;
    border: unset;
    width: 100%;
    background-color: transparent;
    cursor: pointer;
    ${menuItemInnerContainerStyle};
    :hover {
      .delete-button {
        visibility: visible;
        opacity: 1;
      }
    }
  `
}

export const menuItemButtonContentContainerStyle = css`
  display: flex;
  width: 100%;
  padding: 8px;
  gap: 8px;
  align-items: center;
  transition: background-color 0.2s linear;
  border-radius: 16px;
`

export const menuItemButtonContentStyle = css`
  color: ${getColor("grayBlue", "02")};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const menuItemButtonCustomIconContainerStyle = css`
  font-size: 16px;
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const menuItemButtonIconContainerStyle = css`
  font-size: 16px;
  flex: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e5e1ef;
  padding: 4px;
`

export const deleteButtonContainerStyle = (canShow: boolean) => css`
  flex: none;
  width: 24px;
  height: 24px;
  visibility: ${canShow ? "visible" : "hidden"};
  opacity: ${canShow ? "1" : "0"};
  .ant-btn {
    transition: all 0.2s linear;
  }
`

export const navLinkStyle = css`
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
