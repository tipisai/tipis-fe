import { Dispatch, FC, ReactNode, createContext, useReducer } from "react"
import {
  IMarketAction,
  IMarketState,
  INIT_MARKET_STATE,
  reducer,
} from "./reducer"

interface IMarketListInject {
  marketState: IMarketState
  dispatch: Dispatch<IMarketAction>
}

interface IMarketListProviderProps {
  children: ReactNode
}

export const MarketListContext = createContext({} as IMarketListInject)

export const MarketListProvider: FC<IMarketListProviderProps> = ({
  children,
}) => {
  const [marketState, dispatch] = useReducer(reducer, INIT_MARKET_STATE)
  return (
    <MarketListContext.Provider value={{ marketState, dispatch }}>
      {children}
    </MarketListContext.Provider>
  )
}
