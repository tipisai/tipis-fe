import { ReactNode } from "react"

export interface IFeatureCardProps {
  onClick?: () => void
  icon: ReactNode
  title: string
  position: "left" | "right" | "full"
}
