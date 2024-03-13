import { FC } from "react"
import { useLocation } from "react-router-dom"
import { MenuProps } from "./interface"
import { MenuItem } from "./menuItem"
import { menuWrapperStyle, mobileMenuWrapperStyle } from "./style"

const Menu: FC<MenuProps> = (props) => {
  const { itemList, isMobile, onClickMenuItem } = props
  const location = useLocation()

  const wrapperStyle = isMobile ? mobileMenuWrapperStyle : menuWrapperStyle

  return (
    <div css={wrapperStyle}>
      {itemList?.map((item) => {
        const { path, hidden, label } = item
        if (hidden) {
          return null
        }
        return (
          <MenuItem
            key={path}
            isMobile={isMobile}
            selected={Boolean(path && location.pathname.endsWith(path))}
            path={path}
            onClickMenuItem={onClickMenuItem}
            label={label}
          />
        )
      })}
    </div>
  )
}

export default Menu
