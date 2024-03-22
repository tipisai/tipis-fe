import { ReactNode } from "react"

export interface IEditPanelLayoutProps {
  children: ReactNode
  footerChildren?: ReactNode
  customWidth?: string
  canResize?: boolean
}
