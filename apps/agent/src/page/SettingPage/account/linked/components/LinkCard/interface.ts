import { ReactNode } from "react"

export interface LinkCardProps {
  title: string
  description: string
  icon: ReactNode
  type: "google" | "github"
  isConnected: boolean
  hasPassword: boolean
}
