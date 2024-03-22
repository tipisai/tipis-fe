import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
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
import FeatureCard from "../../pc/components/FeatureCard"
import MenuItemButton from "../../pc/components/MenuItemButton"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

const FeatureArea: FC = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleClickCreateTipis = () => {
    const historyTabs = getRecentTabInfos(store.getState())
    const createTipisTab = historyTabs.find(
      (tab) => tab.tabType === TAB_TYPE.CREATE_TIPIS,
    )
    if (!createTipisTab) {
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
    } else {
      dispatch(
        recentTabActions.updateCurrentRecentTabIDReducer(createTipisTab.tabID),
      )
      navigate(
        getCreateTipiPath(currentTeamInfo?.identifier, createTipisTab.cacheID),
      )
    }
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
          title={t("homepage.left_panel.feature.explore_tipi")}
          position="left"
          onClick={handleClickExploreTipis}
        />
        <FeatureCard
          icon={<Icon component={FunctionIcon} />}
          title={t("homepage.left_panel.feature.function")}
          position="right"
          onClick={handleClickFunction}
        />
      </div>
      <MenuItemButton
        text={t("homepage.left_panel.feature.new_chat")}
        icon={<Icon component={PlusIcon} />}
        onClick={handleClickCreateChat}
      />
      <MenuItemButton
        text={t("homepage.left_panel.feature.create_tipi")}
        icon={<Icon component={PenIcon} />}
        onClick={handleClickCreateTipis}
      />
    </div>
  )
}

export default FeatureArea
