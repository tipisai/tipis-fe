import { ReactNode } from "react"

export interface IFirstPageLayoutProps {
  title: string
  children: ReactNode
  headerExtra: ReactNode
  customRenderTitle?: (title: string) => ReactNode
}
