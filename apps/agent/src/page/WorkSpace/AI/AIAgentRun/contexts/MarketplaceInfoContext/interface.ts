import { ReactNode } from "react"
import { IMarketAIAgent } from "@illa-public/public-types"

export interface IMarketPlaceInfoProviderProps {
  children: ReactNode
  marketplaceInfo: IMarketAIAgent | undefined
}

export interface IMarketPlaceInfoInject {
  currentMarketplaceInfo: IMarketAIAgent | undefined
  setCurrentMarketplaceInfo: (info: IMarketAIAgent) => void
}
