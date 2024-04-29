import { ComponentType } from "react"

export interface ITeamCardListItemProps {
  icon: string
  title: string
  publishToMarketplace: boolean
  description: string
  id: string
}
export interface ITeamCardListProps {
  RenderItem: ComponentType<ITeamCardListItemProps>
}
