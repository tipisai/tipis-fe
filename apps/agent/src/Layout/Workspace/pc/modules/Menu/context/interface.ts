import { ReactNode } from "react"

export interface IMenuInject {
  collapsed: boolean
  changeCollapsed: (collapsed: boolean) => void
}

export interface IMenuStatusUIProviderProps {
  children: ReactNode
}
