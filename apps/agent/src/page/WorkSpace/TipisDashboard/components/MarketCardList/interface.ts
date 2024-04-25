import { ComponentType } from "react"
import { IMarketAIAgent } from "@illa-public/public-types"

export interface IMarketCardListItemProps {
  marketAIAgent: IMarketAIAgent
}

export interface IMarketCardEmptyListProps {
  tagList: string[]
  showRecommendTag: boolean
}

export interface IMarketSortComponentProps {
  tagList: string[]
  showRecommendTag: boolean
}

export interface IMarketCardListProps {
  RenderItem: ComponentType<IMarketCardListItemProps>
  RenderEmpty: ComponentType<IMarketCardEmptyListProps>
  RenderSortBy: ComponentType<IMarketSortComponentProps>
}
