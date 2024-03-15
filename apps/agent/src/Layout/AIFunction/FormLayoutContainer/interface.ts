import { ReactNode } from "react"

export interface LayoutContainerProps {
  labelName?: string
  extLabel?: string
  children: ReactNode
  extHeaderNode?: ReactNode
  extChildrenNode?: ReactNode
}
