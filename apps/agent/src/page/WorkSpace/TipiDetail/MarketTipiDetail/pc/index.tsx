import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import PCDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/pc"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { useAddMarketTipiDetailTab } from "@/utils/recentTabs/hook"
import { getExploreTipisPath } from "@/utils/routeHelper"
import PCActionGroup from "../../components/ActionGroup/pc"
import Knowledge from "../../components/Knowledge"
import Parameters from "../../components/Parameters"
import Prompt from "../../components/Prompt"
import { IMarketTipiDetailProps } from "../interface"

const MarketTipiDetailPC: FC<IMarketTipiDetailProps> = ({
  aiAgentMarketPlaceInfo,
}) => {
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

  return (
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
        isFromMarketplace
        runNumber={aiAgentMarketPlaceInfo?.marketplace?.numRuns}
        forkNumber={aiAgentMarketPlaceInfo?.marketplace?.numForks}
        tipisName={aiAgentMarketPlaceInfo.aiAgent.name}
        tipisID={aiAgentMarketPlaceInfo.aiAgent.aiAgentID}
        tipisIcon={aiAgentMarketPlaceInfo.aiAgent.icon}
        ownerTeamIdentity={
          aiAgentMarketPlaceInfo.marketplace.contributorTeam.teamIdentifier
        }
        isPublishConfiguration={
          aiAgentMarketPlaceInfo.marketplace.config.publishConfiguration
        }
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.name}
        teamAvatar={aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.icon}
        contributorAvatars={aiAgentMarketPlaceInfo?.aiAgent?.editedBy.map(
          (item) => item.avatar,
        )}
      />

      {aiAgentMarketPlaceInfo?.marketplace?.config.publishConfiguration && (
        <>
          <Prompt
            parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
            prompt={aiAgentMarketPlaceInfo?.aiAgent?.prompt}
          />
          {Array.isArray(aiAgentMarketPlaceInfo?.aiAgent?.variables) &&
            aiAgentMarketPlaceInfo?.aiAgent?.variables.length > 0 && (
              <Parameters
                parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
              />
            )}
          {Array.isArray(aiAgentMarketPlaceInfo?.aiAgent?.knowledge) &&
            aiAgentMarketPlaceInfo?.aiAgent?.knowledge.length > 0 && (
              <Knowledge knowledge={aiAgentMarketPlaceInfo.aiAgent.knowledge} />
            )}
        </>
      )}
    </DetailLayout>
  )
}

export default MarketTipiDetailPC
