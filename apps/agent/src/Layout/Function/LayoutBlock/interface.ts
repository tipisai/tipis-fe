import { ReactNode } from "react"

export interface ILayoutBlock {
  title: string
  description?: ReactNode
  tips?: string
  subtitle?: string | ReactNode
  children?: ReactNode
  subtitleTips?: string
  required?: boolean
  isMobile?: boolean
}
