import { Tabs } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PRODUCT_SORT_BY } from "@/redux/services/marketAPI/constants"
import { IMarketSortComponentProps } from "../../../components/MarketCardList/interface"
import { MarketListContext } from "../../../context/marketListContext"
import { MARKET_ACTION_TYPE } from "../../../context/reducer"
import TagList from "../TagList"
import { sortWrapperStyle } from "./style"

const SortComponentMobile: FC<IMarketSortComponentProps> = ({ tagList }) => {
  const { t } = useTranslation()
  const options = [
    {
      label: t("dashboard.sort-type.popular"),
      value: PRODUCT_SORT_BY.POPULAR,
      key: PRODUCT_SORT_BY.POPULAR,
    },
    {
      label: t("dashboard.sort-type.recent"),
      value: PRODUCT_SORT_BY.LATEST,
      key: PRODUCT_SORT_BY.LATEST,
    },
    {
      label: t("dashboard.sort-type.star"),
      value: PRODUCT_SORT_BY.STARRED,
      key: PRODUCT_SORT_BY.STARRED,
    },
  ]
  const { dispatch, marketState } = useContext(MarketListContext)

  const onSortChange = (v: string) => {
    if (v === marketState.sortedBy) return
    dispatch({
      type: MARKET_ACTION_TYPE.SET_SORTED_BY,
      payload: v as PRODUCT_SORT_BY,
    })
  }

  const onTagChange = (v?: string) => {
    dispatch({
      type: MARKET_ACTION_TYPE.SET_HASH_TAG,
      payload: v,
    })
  }

  return (
    <div css={sortWrapperStyle}>
      <Tabs
        tabBarStyle={{
          marginBottom: 0,
        }}
        defaultValue={marketState.sortedBy}
        onChange={onSortChange}
        items={options}
        centered
      />

      {tagList && tagList.length > 0 && (
        <TagList
          tagList={tagList}
          handleTagChange={onTagChange}
          activeTag={marketState.hashTag}
        />
      )}
    </div>
  )
}

export default SortComponentMobile
