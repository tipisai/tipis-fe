import Icon from "@ant-design/icons"
import { Input } from "antd"
import { debounce } from "lodash-es"
import { ChangeEvent, FC, useCallback, useContext, useMemo } from "react"
import { SearchIcon } from "@illa-public/icon"
import MarketCardList from "../../../components/MarketCardList"
import { MarketListContext } from "../../../context/marketListContext"
import { MARKET_ACTION_TYPE } from "../../../context/reducer"
import EmptyMarketList from "../../components/EmptyMarketList"
import MarketCard from "../../components/MarketCard"
import SortComponentMobile from "../../components/SortComponent"
import {
  cardListContainerStyle,
  marketContentStyle,
  searchInputStyle,
} from "./style"

const MarketContent: FC = () => {
  const { dispatch } = useContext(MarketListContext)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      dispatch({
        type: MARKET_ACTION_TYPE.SET_SEARCH,
        payload: v,
      })
    },
    [dispatch],
  )

  const debounceHandleChange = useMemo(() => {
    return debounce(handleChange, 160)
  }, [handleChange])

  return (
    <div css={marketContentStyle}>
      <div css={searchInputStyle}>
        <Input
          placeholder="Search"
          prefix={<Icon component={SearchIcon} />}
          size="large"
          onChange={debounceHandleChange}
        />
      </div>

      <div css={cardListContainerStyle}>
        <MarketCardList
          RenderEmpty={EmptyMarketList}
          RenderItem={MarketCard}
          RenderSortBy={SortComponentMobile}
        />
      </div>
    </div>
  )
}

export default MarketContent
