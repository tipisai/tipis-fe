import { useMemo } from "react"
import { MarketAgentListData } from "@illa-public/market-agent"
import { INITIAL_PAGE } from "@/redux/services/marketAPI/constants"
import { IMarketState } from "../../context/reducer"

const INIT_MARKET_LIST_DATA: MarketAgentListData = {
  products: [],
  summaryHashtags: [],
  recommendHashtags: [],
  hasMore: false,
}

export const useGetShowData = (
  data: MarketAgentListData = INIT_MARKET_LIST_DATA,
  marketState: IMarketState,
  isLoading: boolean,
) => {
  const { search, hashTag, page } = marketState
  const { recommendHashtags, summaryHashtags, products } = data

  const showRecommendTag = products.length === 0 && !hashTag
  const isMoreLoading = isLoading && page !== INITIAL_PAGE

  const tagList = useMemo(() => {
    if (search) {
      if (products && products.length > 0) {
        return summaryHashtags || []
      } else if (hashTag) {
        return [hashTag]
      } else {
        return []
      }
    } else {
      return recommendHashtags
    }
  }, [hashTag, products, recommendHashtags, search, summaryHashtags])

  return {
    showRecommendTag,
    tagList,
    isMoreLoading,
  }
}
