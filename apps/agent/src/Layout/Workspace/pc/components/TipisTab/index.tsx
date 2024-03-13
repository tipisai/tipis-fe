import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, MouseEventHandler } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MinusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { getCurrentTabID } from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { ITipsTab } from "./interface"
import {
  deleteButtonContainerStyle,
  menuItemButtonContentContainerStyle,
  menuItemButtonContentStyle,
  menuItemButtonStyle,
} from "./style"
import { genTabNavigateLink, getIconByTabInfo, getTabName } from "./utils"

const TipisTab: FC<ITipsTab> = (props) => {
  const { icon, tabName, tabType, tabID, cacheID } = props
  const currentTabID = useSelector(getCurrentTabID)
  const dispatch = useDispatch()
  const isSelected = currentTabID === tabID
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const navigate = useNavigate()

  const onClick = () => {
    const link = genTabNavigateLink(
      currentTeamInfo.identifier,
      tabType,
      cacheID,
    )
    if (!link) return
    navigate(link)
    dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tabID))
  }

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    dispatch(recentTabActions.deleteRecentTabReducer(tabID))
  }

  return (
    <button css={menuItemButtonStyle(isSelected)} onClick={onClick}>
      <div
        css={menuItemButtonContentContainerStyle}
        className="menu-item-inner-container"
      >
        {getIconByTabInfo(icon, tabType)}
        <span css={menuItemButtonContentStyle}>
          {getTabName(tabName, tabType)}
        </span>
        <div
          css={deleteButtonContainerStyle(isSelected)}
          className="delete-button"
        >
          <Button
            size="small"
            icon={<Icon component={MinusIcon} />}
            onClick={onClickRemoveTab}
            type="text"
          />
        </div>
      </div>
    </button>
  )
}

export default TipisTab
