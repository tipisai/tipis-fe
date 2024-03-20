import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, MouseEventHandler } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { MinusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { getExploreTipisPath } from "@/utils/routeHelper"
import { ITipsTab } from "./interface"
import {
  deleteButtonContainerStyle,
  menuItemButtonContentContainerStyle,
  menuItemButtonContentStyle,
  menuItemButtonStyle,
  navLinkStyle,
} from "./style"
import { genTabNavigateLink, getIconByTabInfo, getTabName } from "./utils"

const shouldModelTipTabTypes = [
  TAB_TYPE.CREATE_FUNCTION,
  TAB_TYPE.CREATE_TIPIS,
  TAB_TYPE.EDIT_FUNCTION,
  TAB_TYPE.EDIT_TIPIS,
]

const TipisTab: FC<ITipsTab> = (props) => {
  const { icon, tabName, tabType, tabID, cacheID } = props
  const dispatch = useDispatch()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { modal } = App.useApp()
  const allRecentTabs = useSelector(getRecentTabInfos)
  const navigate = useNavigate()

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const newTabs = allRecentTabs.filter((tab) => tab.tabID !== tabID)
    function removeTab() {
      dispatch(recentTabActions.deleteRecentTabReducer(tabID))

      if (newTabs.length === 0) {
        navigate(getExploreTipisPath(currentTeamInfo.identifier))
      }
    }
    if (shouldModelTipTabTypes.includes(tabType)) {
      modal.confirm({
        content: "delete",
        onOk: () => {
          removeTab()
        },
      })
      return
    }
    removeTab()
  }

  const onClick = () => {
    dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tabID))
  }

  return (
    <NavLink
      to={genTabNavigateLink(currentTeamInfo.identifier, tabType, cacheID)}
      onClick={onClick}
      css={navLinkStyle}
      unstable_viewTransition
      end
      reloadDocument={false}
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
