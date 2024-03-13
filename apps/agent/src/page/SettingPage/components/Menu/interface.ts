import { HTMLAttributes, ReactNode } from "react"

export interface MenuItems {
  path?: string
  label: ReactNode
  hidden?: boolean
  onClick?: () => void
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  itemList: MenuItems[]
  isMobile?: boolean
  onClickMenuItem?: (path?: string) => void
}
