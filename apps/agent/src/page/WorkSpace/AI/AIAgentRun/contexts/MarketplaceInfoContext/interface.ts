import { ReactNode } from "react"
import { MarketAIAgent } from "@illa-public/public-types"

export interface IMarketPlaceInfoProviderProps {
  children: ReactNode
  marketplaceInfo: MarketAIAgent | undefined
}

export interface IMarketPlaceInfoInject {
  currentMarketplaceInfo: MarketAIAgent | undefined
  setCurrentMarketplaceInfo: (info: MarketAIAgent) => void
}
