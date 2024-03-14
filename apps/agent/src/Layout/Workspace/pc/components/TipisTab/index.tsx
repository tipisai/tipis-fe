import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, MouseEventHandler } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { MinusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { ITipsTab } from "./interface"
import {
  deleteButtonContainerStyle,
  menuItemButtonContentContainerStyle,
  menuItemButtonContentStyle,
  menuItemButtonStyle,
  navLinkStyle,
} from "./style"
import { genTabNavigateLink, getIconByTabInfo, getTabName } from "./utils"

const TipisTab: FC<ITipsTab> = (props) => {
  const { icon, tabName, tabType, tabID, cacheID } = props
  const dispatch = useDispatch()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    dispatch(recentTabActions.deleteRecentTabReducer(tabID))
  }

  return (
    <NavLink
      to={genTabNavigateLink(currentTeamInfo.identifier, tabType, cacheID)}
      css={navLinkStyle}
      unstable_viewTransition
      end
    >
      {({ isActive }) => (
        <div css={menuItemButtonStyle(isActive)}>
          <div
            css={menuItemButtonContentContainerStyle}
            className="menu-item-inner-container"
          >
            {getIconByTabInfo(icon, tabType)}
            <span css={menuItemButtonContentStyle}>
              {getTabName(tabName, tabType)}
            </span>
            <div
              css={deleteButtonContainerStyle(isActive)}
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
        </div>
      )}
    </NavLink>
  )
}

export default TipisTab
