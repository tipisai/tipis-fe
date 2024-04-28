import Icon from "@ant-design/icons"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { NextIcon } from "@illa-public/icon"
import { MenuItemProps, SettingMenuProps } from "./interface"
import { menuItemStyle, rightIconStyle } from "./style"

const Item: FC<MenuItemProps> = ({ onClick, path, label }) => {
  const navigate = useNavigate()

  const handleClick = (path: string) => {
    onClick?.()
    path && navigate(path)
  }

  return (
    <div css={menuItemStyle} onClick={() => handleClick(path)}>
      <div>{label}</div>
      <Icon component={NextIcon} css={rightIconStyle} />
    </div>
  )
}

const SettingMenu: FC<SettingMenuProps> = ({ itemList }) => {
  return (
    <div>
      {itemList.map((item) =>
        item.hidden ? null : <Item key={item.path} {...item} />,
      )}
    </div>
  )
}

export default SettingMenu
