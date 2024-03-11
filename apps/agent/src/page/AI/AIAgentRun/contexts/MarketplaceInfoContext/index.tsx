import { FC, createContext, useMemo, useState } from "react"
import { MarketAIAgent } from "@illa-public/public-types"
import {
  IMarketPlaceInfoInject,
  IMarketPlaceInfoProviderProps,
} from "./interface"

export const MarketplaceInfoContext = createContext(
  {} as IMarketPlaceInfoInject,
)

export const MarketplaceInfoProvider: FC<IMarketPlaceInfoProviderProps> = (
  props,
) => {
  const { children, marketplaceInfo } = props

  const [currentMarketplaceInfo, setCurrentMarketplaceInfo] = useState<
    MarketAIAgent | undefined
  >(marketplaceInfo)

  const value = useMemo(
    () => ({
      currentMarketplaceInfo,
      setCurrentMarketplaceInfo,
    }),
    [currentMarketplaceInfo],
  )

  return (
    <MarketplaceInfoContext.Provider value={value}>
      {children}
    </MarketplaceInfoContext.Provider>
  )
}
