import { Divider } from "antd"
import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import MobileDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/mobile"
import MobileSecondPageLayout from "@/Layout/Workspace/mobile/module/SecondPageLayout"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { useAddMarketTipiDetailTab } from "@/utils/recentTabs/hook"
import { getExploreTipisPath } from "@/utils/routeHelper"
import MobileActionGroup from "../../components/ActionGroup/mobile"
import Knowledge from "../../components/Knowledge"
import Parameters from "../../components/Parameters"
import Prompt from "../../components/Prompt"
import Schedule from "../../components/Schedule"
import { IMarketTipiDetailProps } from "../interface"
import { contentContainerStyle, placeholderDivStyle } from "./style"

const MarketTipiDetailMobile: FC<IMarketTipiDetailProps> = ({
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
    <MobileSecondPageLayout
      title={aiAgentMarketPlaceInfo?.aiAgent.name}
      onClickClose={onClickBack}
      headerExtra={<div css={placeholderDivStyle} />}
    >
      <div css={contentContainerStyle}>
        <MobileDetailHeader
          avatarURL={aiAgentMarketPlaceInfo?.aiAgent?.icon}
          title={aiAgentMarketPlaceInfo?.aiAgent?.name}
          description={aiAgentMarketPlaceInfo?.aiAgent?.description}
        />
        <MobileActionGroup
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
        <Divider
          style={{
            margin: "0",
          }}
        />
        <ContributeInfo
          teamName={aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.name}
          teamAvatar={
            aiAgentMarketPlaceInfo?.marketplace?.contributorTeam?.icon
          }
          contributors={aiAgentMarketPlaceInfo?.aiAgent?.editedBy}
        />

        {aiAgentMarketPlaceInfo?.marketplace?.config.publishConfiguration && (
          <>
            {!!aiAgentMarketPlaceInfo.aiAgent.triggerIsActive && (
              <Schedule
                schedule={
                  aiAgentMarketPlaceInfo.aiAgent.triggerConfig?.schedule ?? []
                }
              />
            )}
            <Prompt
              parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
              prompt={aiAgentMarketPlaceInfo?.aiAgent?.prompt}
            />
            {Array.isArray(aiAgentMarketPlaceInfo?.aiAgent?.variables) &&
              aiAgentMarketPlaceInfo?.aiAgent?.variables && (
                <Parameters
                  parameters={aiAgentMarketPlaceInfo?.aiAgent?.variables ?? []}
                />
              )}
            {Array.isArray(aiAgentMarketPlaceInfo?.aiAgent?.knowledge) &&
              aiAgentMarketPlaceInfo?.aiAgent?.knowledge.length > 0 && (
                <Knowledge
                  knowledge={aiAgentMarketPlaceInfo.aiAgent.knowledge}
                />
              )}
          </>
        )}
      </div>
    </MobileSecondPageLayout>
  )
}

export default MarketTipiDetailMobile
