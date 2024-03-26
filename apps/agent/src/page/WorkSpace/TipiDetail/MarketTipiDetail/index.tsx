import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { getExploreTipisPath } from "@/utils/routeHelper"
import FullSectionLoading from "../../../../components/FullSectionLoading"
import ActionGroup from "../components/ActionGroup"
import Parameters from "../components/Parameters"
import Prompt from "../components/Prompt"

const MarketTipiDetailPage: FC = () => {
  const { agentID } = useParams()
  const {
    data: aiAgentMarketPlaceInfo,
    isLoading,
    isError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()

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
      dispatch(
        recentTabActions.updateRecentTabReducer({
          oldTabID: currentTabID,
          newTabInfo: newTab,
        }),
      )
      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(cacheID))
    } else {
      dispatch(recentTabActions.addRecentTabReducer(newTab))
    }
    navigate(getExploreTipisPath(currentTeamInfo.identifier))
  }

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return aiAgentMarketPlaceInfo ? (
    <DetailLayout
      title={aiAgentMarketPlaceInfo?.aiAgent.name}
      onClickBack={onClickBack}
    >
      <DetailHeader
        avatarURL={aiAgentMarketPlaceInfo?.aiAgent?.icon}
        title={aiAgentMarketPlaceInfo?.aiAgent?.name}
        description={aiAgentMarketPlaceInfo?.aiAgent?.description}
      />
      <ActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo?.marketplace?.numRuns}
        forkNumber={aiAgentMarketPlaceInfo?.marketplace?.numForks}
        starNumber={aiAgentMarketPlaceInfo.marketplace.numStars}
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.name}
        teamAvatar={aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.icon}
        contributorAvatars={aiAgentMarketPlaceInfo?.aiAgent?.editedBy.map(
          (item) => item.avatar,
        )}
      />
      <Prompt
        parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
        prompt={aiAgentMarketPlaceInfo?.aiAgent?.prompt}
      />
      <Parameters
        parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
      />
    </DetailLayout>
  ) : null
}

export default MarketTipiDetailPage
