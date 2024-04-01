import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import FullSectionLoading from "@/components/FullSectionLoading"
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
import { useGetTipiContributedDetail } from "@/utils/tipis/hook"
import ActionGroup from "../components/ActionGroup"
import Knowledge from "../components/Knowledge"
import Parameters from "../components/Parameters"
import Prompt from "../components/Prompt"

const ContributeTipiDetail: FC = () => {
  const { contributeAgentDetail, isError, isLoading, aiAgentMarketPlaceInfo } =
    useGetTipiContributedDetail()
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()

  const addTipiDetailTab = useAddTipisDetailTab()

  useEffect(() => {
    if (contributeAgentDetail) {
      addTipiDetailTab({
        tipisID: contributeAgentDetail.aiAgentID,
        title: contributeAgentDetail.name,
        tabIcon: contributeAgentDetail.icon,
      })
    }
  }, [addTipiDetailTab, contributeAgentDetail])

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

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }
  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <DetailLayout title={contributeAgentDetail?.name} onClickBack={onClickBack}>
      <DetailHeader
        avatarURL={contributeAgentDetail.icon}
        title={contributeAgentDetail.name}
        description={contributeAgentDetail.description}
      />
      <ActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo.marketplace.numRuns}
        forkNumber={aiAgentMarketPlaceInfo.marketplace.numForks}
        starNumber={aiAgentMarketPlaceInfo.marketplace.numStars}
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo.marketplace.contributorTeam.name}
        teamAvatar={aiAgentMarketPlaceInfo.marketplace.contributorTeam.icon}
        contributorAvatars={contributeAgentDetail.editedBy.map(
          (item) => item.avatar,
        )}
      />
      <Prompt
        parameters={contributeAgentDetail.variables ?? []}
        prompt={contributeAgentDetail.prompt}
      />
      <Parameters parameters={contributeAgentDetail.variables ?? []} />
      <Knowledge knowledge={contributeAgentDetail.knowledge ?? []} />
    </DetailLayout>
  ) : null
}

ContributeTipiDetail.displayName = "ContributeTipiDetail"

export default ContributeTipiDetail
