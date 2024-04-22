import { Checkbox, Tabs } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PRODUCT_SORT_BY } from "@/redux/services/marketAPI/constants"
import { IMarketSortComponentProps } from "../../../components/MarketCardList/interface"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../../../context/interface"
import { DashBoardUIStateContext } from "../../../context/marketListContext"
import TagList from "../TagList"
import {
  checkBoxContainerStyle,
  sortHeaderStyle,
  sortWrapperStyle,
} from "./style"

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

  const onOfficialChange = (e: CheckboxChangeEvent) => {
    const v = e.target.checked
    dispatch({
      type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_IS_OFFICIAL,
      payload: v,
    })
  }

  return (
    <div css={sortWrapperStyle}>
      <div css={sortHeaderStyle}>
        <Tabs
          tabBarStyle={{
            marginBottom: 0,
          }}
          style={{
            width: "100%",
          }}
          defaultValue={marketState.sortedBy}
          onChange={onSortChange}
          items={options}
        />

        <div css={checkBoxContainerStyle}>
          <Checkbox
            checked={marketState.isOfficial}
            onChange={onOfficialChange}
          >
            {t("dashboard.sort-type.official")}
          </Checkbox>
        </div>
      </div>

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
