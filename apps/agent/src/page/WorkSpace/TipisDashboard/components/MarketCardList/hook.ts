import { useMemo } from "react"
import { IMarketAgentListData } from "@illa-public/public-types"
import { INITIAL_PAGE } from "@/redux/services/marketAPI/constants"
import { IDashBoardUIState } from "../../context/interface"

const INIT_MARKET_LIST_DATA: IMarketAgentListData = {
  products: [],
  summaryHashtags: [],
  recommendHashtags: [],
  hasMore: false,
}

export const useGetShowData = (
  data: IMarketAgentListData = INIT_MARKET_LIST_DATA,
  marketState: IDashBoardUIState,
  isLoading: boolean,
) => {
  const { hashTag, page } = marketState
  const { recommendHashtags, summaryHashtags, products } = data

  const showRecommendTag = products.length === 0 && !hashTag
  const isMoreLoading = isLoading && page !== INITIAL_PAGE

  const tagList = useMemo(() => {
    if (products && products.length > 0) {
      return summaryHashtags || []
    } else if (hashTag) {
      return [hashTag]
    } else {
      return recommendHashtags
    }
  }, [hashTag, products, recommendHashtags, summaryHashtags])

  return {
    showRecommendTag,
    tagList,
    isMoreLoading,
  }
}
