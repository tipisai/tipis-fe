import { List } from "antd"
import { FC, UIEvent, useContext } from "react"
import { MarketAgentListData } from "@illa-public/market-agent"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetMarketListQuery } from "@/redux/services/marketAPI"
import { MarketListContext } from "../../context/marketListContext"
import { MARKET_ACTION_TYPE } from "../../context/reducer"
import { useGetShowData } from "./hook"
import { IMarketCardListProps } from "./interface"
import { contentStyle, moreLoadingStyle } from "./style"
import { TEMP_DATA } from "./temp"

const MarketCardList: FC<IMarketCardListProps> = (props) => {
  const { RenderEmpty, RenderItem, RenderSortBy } = props
  const { marketState, dispatch } = useContext(MarketListContext)

  const { data: _data, isLoading } = useGetMarketListQuery({
    params: {
      ...marketState,
      limit: 40,
    },
  })

  const data = TEMP_DATA as unknown as MarketAgentListData

  const { tagList, showRecommendTag, isMoreLoading } = useGetShowData(
    data,
    marketState,
    isLoading,
  )

  const handleListLoadMore = async (event: UIEvent<HTMLDivElement>) => {
    if (isMoreLoading || !data.hasMore) return
    const target = event.target as HTMLDivElement
    if (target.scrollHeight - target.scrollTop - target.clientHeight <= 800) {
      dispatch({
        type: MARKET_ACTION_TYPE.SET_PAGE,
        payload: marketState.page + 1,
      })
    }
  }

  if (!data?.products || data.products.length === 0) {
    return <RenderEmpty tagList={tagList} showRecommendTag={showRecommendTag} />
  }

  return (
    <div css={contentStyle} onScroll={handleListLoadMore}>
      <RenderSortBy tagList={tagList} />
      {isLoading && !isMoreLoading ? (
        <FullSectionLoading />
      ) : (
        <>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 5,
            }}
            dataSource={data.products}
            renderItem={(item) => (
              <RenderItem marketAIAgent={item} onClick={() => {}} />
            )}
          />
          {isMoreLoading && (
            <div css={moreLoadingStyle}>
              <FullSectionLoading />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MarketCardList
