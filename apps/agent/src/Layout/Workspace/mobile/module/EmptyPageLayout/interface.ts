import { ReactNode } from "react"

export interface IEmptyPageLayoutMobile {
  title: string
  children: ReactNode
  openCreateModal: () => void
}
