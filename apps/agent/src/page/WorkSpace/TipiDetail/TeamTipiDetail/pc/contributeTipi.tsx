import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import {
  useAddRecentTabReducer,
  useUpdateRecentTabReducer,
} from "@/utils/recentTabs/baseHook"
import { useAddTipisDetailTab } from "@/utils/recentTabs/hook"
import { getExploreTipisPath } from "@/utils/routeHelper"
import { IContributeTipiProps } from "../interface"
import ContributeContent from "../module/contributeContent"

const PCContributeTipi: FC<IContributeTipiProps> = (props) => {
  const { contributeAgentDetail, aiAgentMarketPlaceInfo } = props

  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()
  const addTipiDetailTab = useAddTipisDetailTab()

  const onClickBack = () => {
    const currentTabID = getCurrentTabID(store.getState())
    const recentTabs = getRecentTabInfos(store.getState())
    const currentTab = recentTabs.find((tab) => tab.tabID === currentTabID)
    const cacheID = v4()
    const newTab = {
      ...currentTab,
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_TIPIS,
      tabID: cacheID,
      cacheID: cacheID,
    }
    if (currentTab) {
      updateRecentTab(currentTabID, newTab)
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(cacheID))
    } else {
      addRecentTab(newTab)
    }
    navigate(getExploreTipisPath(currentTeamInfo.identifier))
  }

  useEffect(() => {
    if (contributeAgentDetail) {
      addTipiDetailTab({
        tipisID: contributeAgentDetail.aiAgentID,
        title: contributeAgentDetail.name,
        tabIcon: contributeAgentDetail.icon,
      })
    }
  }, [addTipiDetailTab, contributeAgentDetail])

  return (
    <DetailLayout title={contributeAgentDetail?.name} onClickBack={onClickBack}>
      <ContributeContent
        contributeAgentDetail={contributeAgentDetail}
        aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo}
      />
    </DetailLayout>
  )
}

export default PCContributeTipi
