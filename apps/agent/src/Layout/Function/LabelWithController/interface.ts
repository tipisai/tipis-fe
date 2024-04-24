import { ReactNode } from "react"

export interface ILabelWithControllerProps {
  title: string
  required?: boolean
  children: ReactNode
  errorMessage?: string
}
