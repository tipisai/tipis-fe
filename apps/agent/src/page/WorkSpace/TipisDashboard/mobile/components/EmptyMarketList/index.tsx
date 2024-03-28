import Icon from "@ant-design/icons"
import { Empty } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { EmptyIcon } from "@illa-public/icon"
import { IMarketCardEmptyListProps } from "../../../components/MarketCardList/interface"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../../../context/interface"
import { DashBoardUIStateContext } from "../../../context/marketListContext"
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

  const { dispatch } = useContext(DashBoardUIStateContext)

  const handleClick = (name?: string) => {
    if (!name) return
    dispatch({
      type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_RECOMMEND_TAG,
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
