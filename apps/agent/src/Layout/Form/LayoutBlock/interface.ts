import { ReactNode } from "react"

export interface ILayoutBlock {
  title: string
  tips?: string
  subtitle?: string | ReactNode
  children?: ReactNode
  subtitleTips?: string
  required?: boolean
  scrollId?: string
  isMobile?: boolean
  errorMessage?: string
  customRenderSubtitle?: ReactNode
}
