import { ReactNode } from "react"

export interface ISecondPageLayoutProps {
  title: string
  children: ReactNode
  headerExtra?: ReactNode
  onClickClose: () => void
  customRenderTitle?: (title: string) => ReactNode
}
