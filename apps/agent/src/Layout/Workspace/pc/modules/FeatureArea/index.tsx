import Icon from "@ant-design/icons"
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import store from "@/redux/store"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import {
  getCreateTipiPath,
  getDefaultChatPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
} from "@/utils/routeHelper"
import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

const FeatureArea: FC = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()

  const handleClickCreateTipis = () => {
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CREATE_TIPIS,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(getCreateTipiPath(currentTeamInfo?.identifier, tempID))
  }

  const handleClickCreateChat = () => {
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CHAT,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(getDefaultChatPath(currentTeamInfo?.identifier, tempID))
  }

  const handleClickExploreTipis = () => {
    const historyTabs = getRecentTabInfos(store.getState())
    const tipisTab = historyTabs.find(
      (item) => item.tabType === TAB_TYPE.EXPLORE_TIPIS,
    )
    if (tipisTab) {
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(tipisTab.tabID))
    } else {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.EXPLORE_TIPIS,
        tabID: tempID,
        cacheID: tempID,
      }
      dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    }
    navigate(getExploreTipisPath(currentTeamInfo?.identifier))
  }

  const handleClickFunction = () => {
    const historyTabs = getRecentTabInfos(store.getState())
    const functionTab = historyTabs.find(
      (item) => item.tabType === TAB_TYPE.EXPLORE_FUNCTION,
    )
    if (functionTab) {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(functionTab.tabID),
      )
    } else {
      const tempID = v4()
      const tabsInfo: ITabInfo = {
        tabName: "",
        tabIcon: "",
        tabType: TAB_TYPE.EXPLORE_FUNCTION,
        tabID: tempID,
        cacheID: tempID,
      }
      dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    }

    navigate(getExploreFunctionsPath(currentTeamInfo?.identifier))
  }

  return (
    <div css={featureAreaContainerStyle}>
      <div css={featureCardsContainerStyle}>
        <FeatureCard
          icon={<Icon component={MarketplaceIcon} />}
          title="Explore tipi"
          position="left"
          onClick={handleClickExploreTipis}
        />
        <FeatureCard
          icon={<Icon component={FunctionIcon} />}
          title="Function"
          position="right"
          onClick={handleClickFunction}
        />
      </div>
      <MenuItemButton
        text="New Chat"
        icon={<Icon component={PlusIcon} />}
        onClick={handleClickCreateChat}
      />
      <MenuItemButton
        text="Create a tipis"
        icon={<Icon component={PenIcon} />}
        onClick={handleClickCreateTipis}
      />
    </div>
  )
}

export default FeatureArea
