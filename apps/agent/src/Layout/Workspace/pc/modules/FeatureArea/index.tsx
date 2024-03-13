import Icon from "@ant-design/icons"
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
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
    navigate(`/workspace/${currentTeamInfo?.identifier}/tipis/create/${tempID}`)
  }

  const handleClickExploreTipis = () => {
    // 查找并替换 不要新增。
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_TIPIS,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(`/workspace/${currentTeamInfo?.identifier}/tipis`)
  }

  const handleClickFunction = () => {
    // 查找并替换 不要新增。
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_FUNCTION,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(`/workspace/${currentTeamInfo?.identifier}/function`)
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
      <MenuItemButton text="New Chat" icon={<Icon component={PlusIcon} />} />
      <MenuItemButton
        text="Create a tipis"
        icon={<Icon component={PenIcon} />}
        onClick={handleClickCreateTipis}
      />
    </div>
  )
}

export default FeatureArea
