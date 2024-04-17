import Icon from "@ant-design/icons"
import { App, Button, Tooltip } from "antd"
import { FC, MouseEventHandler, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { MinusIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import {
  getRecentTabInfos,
  getRecentTabInfosByID,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import { useRemoveRecentTabReducer } from "@/utils/recentTabs/baseHook"
import { getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import DropIndicator from "../../DropIndicator/DropIndicator"
import {
  baseMenuItemContainerStyle,
  draggingStyle,
  pcActionButtonStyle,
} from "../../baseTabStyle"
import { useTabSortableItem } from "../../hook"
import { SHOULD_MODEL_TIP_TAB_TYPES } from "../constant"
import { menuItemNameStyle, menuItemStyle, navLinkStyle } from "../style"
import { genTabNavigateLink, getIconByTabInfo, useGetTabName } from "../utils"
import { IPCTipisTab } from "./interface"

const PCTipisTab: FC<IPCTipisTab> = (props) => {
  const { tabID, isMiniSize, index } = props
  const tabInfo = useSelector((state) => getRecentTabInfosByID(state, tabID))!
  const dispatch = useDispatch()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { modal } = App.useApp()
  const allRecentTabs = useSelector(getRecentTabInfos)
  const navigate = useNavigate()
  const deleteTab = useRemoveRecentTabReducer()
  const { t } = useTranslation()

  const getTabName = useGetTabName()

  const ref = useRef<HTMLAnchorElement>(null)

  const { closestEdge, draggableState } = useTabSortableItem(
    index,
    tabInfo ? { ...tabInfo } : undefined,
    ref,
  )

  const { tabType, tabIcon, cacheID, tabName } = tabInfo

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    TipisTrack.track("click_close_tab")
    const newTabs = allRecentTabs.filter((tab) => tab.tabID !== tabID)
    async function removeTab() {
      await deleteTab(tabID)

      if (newTabs.length === 1) {
        navigate(getChatPath(currentTeamInfo?.identifier ?? ""))
        return
      }
      const latestTab = newTabs[0]
      const newPath = genTabNavigateLink(
        currentTeamInfo?.identifier ?? "",
        latestTab.tabType,
        latestTab.cacheID,
        latestTab.tabID,
      )
      navigate(newPath)
    }
    if (SHOULD_MODEL_TIP_TAB_TYPES.includes(tabType)) {
      modal.confirm({
        content: t("homepage.edit_tipi.modal.not_save_desc"),
        okText: t("homepage.edit_tipi.modal.not_save_ok"),
        cancelText: t("homepage.edit_tipi.modal.not_save_cancel"),
        onOk: removeTab,
      })

      return
    }
    await removeTab()
  }

  const onClick = () => {
    dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tabID))
  }

  const navLinkComp = (
    <NavLink
      ref={ref}
      to={genTabNavigateLink(
        currentTeamInfo?.identifier,
        tabType,
        cacheID,
        tabID,
      )}
      onClick={onClick}
      css={[
        navLinkStyle(isMiniSize),
        draggableState.type === "dragging" && draggingStyle,
      ]}
      unstable_viewTransition
      end
      reloadDocument={false}
    >
      {({ isActive }) => (
        <>
          <div css={menuItemStyle(isActive)}>
            <div
              css={baseMenuItemContainerStyle(isMiniSize)}
              className="menu-item-inner-container"
            >
              {getIconByTabInfo(tabIcon, tabType)}
              {!isMiniSize && (
                <span css={menuItemNameStyle(isActive)}>
                  {getTabName(tabName, tabType, tabID)}
                </span>
              )}
              {!isMiniSize && tabID !== DEFAULT_CHAT_ID && (
                <div
                  css={pcActionButtonStyle(isActive)}
                  className="delete-button"
                >
                  <Button
                    size="small"
                    icon={<Icon component={MinusIcon} />}
                    onClick={onClickRemoveTab}
                    type="text"
                  />
                </div>
              )}
            </div>
            {closestEdge && <DropIndicator edge={closestEdge} />}
          </div>
        </>
      )}
    </NavLink>
  )

  return isMiniSize ? (
    <Tooltip
      title={getTabName(tabName, tabType, tabID)}
      placement="right"
      align={{
        offset: [6, 0],
      }}
    >
      {navLinkComp}
    </Tooltip>
  ) : (
    navLinkComp
  )
}

export default PCTipisTab
