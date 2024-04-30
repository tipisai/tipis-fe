import { ComponentType } from "react"
import { TIntegrationType } from "@illa-public/public-types"

export interface ITeamCardListItemProps {
  icon: string
  title: string
  publishToMarketplace: boolean
  description: string
  id: string
  type: TIntegrationType
}

export interface ITeamCardListProps {
  RenderItem: ComponentType<ITeamCardListItemProps>
}
