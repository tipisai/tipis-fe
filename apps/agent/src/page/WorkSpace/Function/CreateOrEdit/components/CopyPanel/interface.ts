import { ReactNode } from "react"

export interface ICopyPanelProps {
  title: string
  copyButtonProps?: {
    text?: string
    disabled?: boolean
  }
  content: ReactNode
  onClickCopyButton: () => void
}
