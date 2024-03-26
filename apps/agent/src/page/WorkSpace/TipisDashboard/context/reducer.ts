import {
  INITIAL_PAGE,
  PRODUCT_SORT_BY,
} from "@/redux/services/marketAPI/constants"

export interface IMarketState {
  page: number
  sortedBy: PRODUCT_SORT_BY
  search: string | undefined
  hashTag: string | undefined
}

export enum MARKET_ACTION_TYPE {
  SET_PAGE = "SET_PAGE",
  SET_SORTED_BY = "SET_SORTED_BY",
  SET_SEARCH = "SET_SEARCH",
  SET_HASH_TAG = "SET_HASH_TAG",
  SET_RECOMMEND_TAG = "SET_RECOMMEND_TAG",
  RESET_PARAMS = "RESET_PARAMS",
}

export interface IMarketAction {
  type: MARKET_ACTION_TYPE
  payload?: any
}

export const INIT_MARKET_STATE = {
  page: INITIAL_PAGE,
  sortedBy: PRODUCT_SORT_BY.POPULAR,
  search: undefined,
  hashTag: undefined,
}

export const reducer = (state: IMarketState, action: IMarketAction) => {
  switch (action.type) {
    case MARKET_ACTION_TYPE.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      }
    case MARKET_ACTION_TYPE.SET_SORTED_BY:
      return {
        ...state,
        page: INITIAL_PAGE,
        sortedBy: action.payload,
      }
    case MARKET_ACTION_TYPE.SET_SEARCH:
      return {
        ...state,
        page: INITIAL_PAGE,
        search: action.payload,
      }

    case MARKET_ACTION_TYPE.SET_HASH_TAG:
      return {
        ...state,
        page: INITIAL_PAGE,
        hashTag: action.payload,
      }

    case MARKET_ACTION_TYPE.SET_RECOMMEND_TAG:
      return {
        page: INITIAL_PAGE,
        sortedBy: PRODUCT_SORT_BY.POPULAR,
        search: undefined,
        hashTag: action.payload,
      }

    case MARKET_ACTION_TYPE.RESET_PARAMS:
      return INIT_MARKET_STATE
    default:
      return state
  }
}
