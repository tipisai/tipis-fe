import { List } from "antd"
import { FC, UIEvent, useContext, useRef } from "react"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetMarketListQuery } from "@/redux/services/marketAPI"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../../context/interface"
import { DashBoardUIStateContext } from "../../context/marketListContext"
import { useGetShowData } from "./hook"
import { IMarketCardListProps } from "./interface"
import { contentStyle, listContainerStyle, moreLoadingStyle } from "./style"

const MarketCardList: FC<IMarketCardListProps> = (props) => {
  const { RenderEmpty, RenderItem, RenderSortBy } = props
  const { dashboardUIState: marketState, dispatch } = useContext(
    DashBoardUIStateContext,
  )

  const cacheLastScroll = useRef<number>(0)
  const { data, isFetching } = useGetMarketListQuery(marketState)

  const { tagList, showRecommendTag, isMoreLoading } = useGetShowData(
    data,
    marketState,
    isFetching,
  )

  const flag = useRef(false)
  const handleListLoadMore = async (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    if (flag.current || !data || isFetching || isMoreLoading || !data.hasMore) {
      cacheLastScroll.current = target.scrollTop
      return
    }
    if (
      target.scrollTop > cacheLastScroll.current &&
      target.scrollHeight - target.scrollTop - target.clientHeight <= 800
    ) {
      flag.current = true
      dispatch({
        type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_PAGE,
        payload: marketState.page + 1,
      })
      setTimeout(() => {
        flag.current = false
      }, 500)
    }
    cacheLastScroll.current = target.scrollTop
  }

  return (
    <div css={contentStyle}>
      <RenderSortBy tagList={tagList} showRecommendTag={showRecommendTag} />
      {isFetching && !isMoreLoading ? (
        <FullSectionLoading />
      ) : !data?.products || data.products.length === 0 ? (
        <RenderEmpty tagList={tagList} showRecommendTag={showRecommendTag} />
      ) : (
        <div css={listContainerStyle} onScroll={handleListLoadMore}>
          <List
            grid={{
              gutter: 24,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 6,
            }}
            dataSource={data.products}
            renderItem={(item) => <RenderItem marketAIAgent={item} />}
          />
          {isMoreLoading && (
            <div css={moreLoadingStyle}>
              <FullSectionLoading />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketCardList
