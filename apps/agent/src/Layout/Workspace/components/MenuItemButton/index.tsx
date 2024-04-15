import { FC } from "react"
import { IMenuItemButtonProps } from "./interface"
import {
  menuItemButtonContentContainerStyle,
  menuItemButtonContentStyle,
  menuItemButtonIconContainerStyle,
  menuItemButtonStyle,
} from "./style"

const MenuItemButton: FC<IMenuItemButtonProps> = (props) => {
  const { icon, extra, text, onClick } = props
  return (
    <div css={menuItemButtonStyle} onClick={onClick}>
      <div
        css={menuItemButtonContentContainerStyle}
        className="menu-item-inner-container"
      >
        <span css={menuItemButtonIconContainerStyle}>{icon}</span>
        <span css={menuItemButtonContentStyle}>{text}</span>
        {extra}
      </div>
    </div>
  )
}

export default MenuItemButton
