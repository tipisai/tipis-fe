import { ReactNode } from "react"

export interface LinkCardProps {
  title: string
  description: string
  icon: ReactNode
  handleClick: () => void
  isConnected: boolean
}
