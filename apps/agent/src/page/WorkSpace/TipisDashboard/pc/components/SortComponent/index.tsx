import { Tabs } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PRODUCT_SORT_BY } from "@/redux/services/marketAPI/constants"
import { IMarketSortComponentProps } from "../../../components/MarketCardList/interface"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../../../context/interface"
import { DashBoardUIStateContext } from "../../../context/marketListContext"
import TagList from "../TagList"
import { sortWrapperStyle } from "./style"

const SortComponentPC: FC<IMarketSortComponentProps> = ({ tagList }) => {
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
  const { dispatch, dashboardUIState: marketState } = useContext(
    DashBoardUIStateContext,
  )

  const onSortChange = (v: string) => {
    if (v === marketState.sortedBy) return
    dispatch({
      type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_SORTED_BY,
      payload: v as PRODUCT_SORT_BY,
    })
  }

  const onTagChange = (v?: string) => {
    dispatch({
      type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_HASH_TAG,
      payload: v,
    })
  }

  return (
    <div css={sortWrapperStyle}>
      <Tabs
        tabBarStyle={{
          marginBottom: 0,
        }}
        activeKey={marketState.sortedBy}
        onChange={onSortChange}
        items={options}
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

export default SortComponentPC
