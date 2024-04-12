import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import PCDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/pc"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { useAddMarketTipiDetailTab } from "@/utils/recentTabs/hook"
import { getExploreTipisPath } from "@/utils/routeHelper"
import PCActionGroup from "../components/ActionGroup/pc"
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
  const addMarketTipiDetailTab = useAddMarketTipiDetailTab()

  useEffect(() => {
    if (aiAgentMarketPlaceInfo) {
      addMarketTipiDetailTab({
        tipisID: aiAgentMarketPlaceInfo.aiAgent.aiAgentID,
        title: aiAgentMarketPlaceInfo.aiAgent.name,
        tabIcon: aiAgentMarketPlaceInfo.aiAgent.icon,
      })
    }
  }, [addMarketTipiDetailTab, aiAgentMarketPlaceInfo])

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
      <PCDetailHeader
        avatarURL={aiAgentMarketPlaceInfo?.aiAgent?.icon}
        title={aiAgentMarketPlaceInfo?.aiAgent?.name}
        description={aiAgentMarketPlaceInfo?.aiAgent?.description}
      />
      <PCActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo?.marketplace?.numRuns}
        forkNumber={aiAgentMarketPlaceInfo?.marketplace?.numForks}
        starNumber={aiAgentMarketPlaceInfo.marketplace.numStars}
        tipisName={aiAgentMarketPlaceInfo.aiAgent.name}
        tipisID={aiAgentMarketPlaceInfo.aiAgent.teamID}
        tipisIcon={aiAgentMarketPlaceInfo.aiAgent.icon}
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
