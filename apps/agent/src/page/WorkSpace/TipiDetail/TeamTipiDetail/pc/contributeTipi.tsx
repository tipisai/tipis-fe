import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
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
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IContributeTipiProps } from "../interface"
import PCContributeContent from "../module/contributeContent/pc"

const PCContributeTipi: FC<IContributeTipiProps> = (props) => {
  const { aiAgentMarketPlaceInfo } = props

  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const dispatch = useDispatch()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()
  const addTipiDetailTab = useAddTipisDetailTab()

  const onClickBack = async () => {
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
      await updateRecentTab(currentTabID, newTab)
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(cacheID))
    } else {
      await addRecentTab(newTab)
    }
    navigate(getExploreTipisPath(currentTeamInfo.identify))
  }

  useEffect(() => {
    if (aiAgentMarketPlaceInfo && aiAgentMarketPlaceInfo.aiAgent) {
      addTipiDetailTab({
        tipisID: aiAgentMarketPlaceInfo.aiAgent.aiAgentID,
        title: aiAgentMarketPlaceInfo.aiAgent.name,
        tabIcon: aiAgentMarketPlaceInfo.aiAgent.icon,
      })
    }
  }, [addTipiDetailTab, aiAgentMarketPlaceInfo])

  return (
    <DetailLayout
      title={aiAgentMarketPlaceInfo.aiAgent.name}
      onClickBack={onClickBack}
    >
      <PCContributeContent aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo} />
    </DetailLayout>
  )
}

export default PCContributeTipi
