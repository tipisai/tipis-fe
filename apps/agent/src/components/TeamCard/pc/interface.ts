import { ReactNode } from "react"

export interface IPCTeamCardProps {
  icon: string
  title: string
  description: string
  tags: ReactNode
  moreButton: ReactNode
  editButton: ReactNode
  onClickCard?: () => void
}
