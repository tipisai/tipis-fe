import { ReactNode } from "react"

export interface IMobileTeamCardProps {
  icon: string
  title: string
  description: string
  tags: ReactNode
  moreButton: ReactNode
  onClickCard?: () => void
}
