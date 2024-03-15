export interface MenuItemProps {
  path: string
  label: string
  needPro?: boolean
  hidden?: boolean
  onClick?: () => void
}

export interface SettingMenuProps {
  itemList: MenuItemProps[]
}
