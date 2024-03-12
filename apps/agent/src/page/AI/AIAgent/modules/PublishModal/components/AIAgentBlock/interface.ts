import { ReactNode } from "react"

export interface IModalEditorBlockProps {
  title: string
  tips?: string
  subtitle?: string | ReactNode
  children?: ReactNode
  subtitleTips?: string
  required?: boolean
}
