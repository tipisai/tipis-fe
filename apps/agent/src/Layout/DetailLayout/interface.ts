import { ReactNode } from "react"

export interface IDetailLayoutProps {
  children: ReactNode
  title: string
  onClickBack: () => void
}
