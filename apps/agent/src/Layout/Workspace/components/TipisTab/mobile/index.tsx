import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, MouseEventHandler } from "react"
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
import { SHOULD_MODEL_TIP_TAB_TYPES } from "../constant"
import { genTabNavigateLink, getIconByTabInfo, useGetTabName } from "../utils"
import { IMobileTipisTabProps } from "./interface"
import {
  deleteButtonContainerStyle,
  menuItemButtonContentContainerStyle,
  menuItemButtonContentStyle,
  menuItemButtonStyle,
  navLinkStyle,
} from "./style"

const MobileTipisTab: FC<IMobileTipisTabProps> = (props) => {
  const { tabID } = props
  const tabInfos = useSelector((state) => getRecentTabInfosByID(state, tabID))
  const dispatch = useDispatch()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { modal } = App.useApp()
  const allRecentTabs = useSelector(getRecentTabInfos)
  const navigate = useNavigate()
  const deleteTab = useRemoveRecentTabReducer()
  const { t } = useTranslation()

  const getTabName = useGetTabName()

  if (!tabInfos) return

  const { tabIcon, tabName, tabType, cacheID } = tabInfos

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

  return (
    <NavLink
      to={genTabNavigateLink(
        currentTeamInfo?.identifier,
        tabType,
        cacheID,
        tabID,
      )}
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
            {getIconByTabInfo(tabIcon, tabType)}
            <span css={menuItemButtonContentStyle(isActive)}>
              {getTabName(tabName, tabType, tabID)}
            </span>
            {tabID !== DEFAULT_CHAT_ID && (
              <div css={deleteButtonContainerStyle} className="delete-button">
                <Button
                  size="small"
                  icon={<Icon component={MinusIcon} />}
                  onClick={onClickRemoveTab}
                  type="text"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </NavLink>
  )
}

export default MobileTipisTab
