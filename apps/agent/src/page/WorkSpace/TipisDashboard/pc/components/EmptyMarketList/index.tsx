import Icon from "@ant-design/icons"
import { Empty } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { EmptyIcon } from "@illa-public/icon"
import { IMarketCardEmptyListProps } from "../../../components/MarketCardList/interface"
import { MarketListContext } from "../../../context/marketListContext"
import { MARKET_ACTION_TYPE } from "../../../context/reducer"
import TagList from "../TagList"
import {
  emptyColorStyle,
  emptyIconStyle,
  listEmptyContainerStyle,
} from "./style"

const EmptyMarketList: FC<IMarketCardEmptyListProps> = ({
  showRecommendTag,
  tagList,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(MarketListContext)

  const handleClick = (name?: string) => {
    if (!name) return
    dispatch({
      type: MARKET_ACTION_TYPE.SET_RECOMMEND_TAG,
      payload: name,
    })
  }
  return (
    <div css={listEmptyContainerStyle}>
      <Empty
        imageStyle={{ height: "auto" }}
        image={<Icon component={EmptyIcon} css={emptyIconStyle} />}
        description={<span css={emptyColorStyle}>{t("status.blank")}</span>}
      />
      {showRecommendTag && (
        <TagList
          tagList={tagList}
          isEmptyRecommend
          handleTagChange={handleClick}
        />
      )}
    </div>
  )
}

export default EmptyMarketList
