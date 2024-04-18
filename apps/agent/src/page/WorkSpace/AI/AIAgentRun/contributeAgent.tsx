import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Navigate, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import MobileCustomTitle from "@/Layout/Workspace/mobile/components/CustomTitle"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import PCCustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import { useAddOrUpdateRunTipisTab } from "@/utils/recentTabs/hook"
import { AgentInitial, IAgentForm } from "../AIAgent/interface"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import { InputVariablesModalProvider } from "./AIAgentRunPC/context/InputVariablesModalContext"
import MoreActionButton from "./components/MoreActionButton"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const ContributedAgent: FC = () => {
  const { agentID } = useParams()

  const {
    data: aiAgentMarketPlaceInfo,
    isLoading,
    isError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })
  const { tabID } = useParams()

  const addAgentRunTab = useAddOrUpdateRunTipisTab()

  useEffect(() => {
    if (aiAgentMarketPlaceInfo && aiAgentMarketPlaceInfo.aiAgent && tabID) {
      addAgentRunTab(
        {
          tipisID: aiAgentMarketPlaceInfo.aiAgent.aiAgentID,
          tipisIcon: aiAgentMarketPlaceInfo.aiAgent.icon,
          tipisName: aiAgentMarketPlaceInfo.aiAgent.name,
        },
        tabID,
      )
    }
  }, [addAgentRunTab, tabID, aiAgentMarketPlaceInfo])

  const methods = useForm<IAgentForm>({
    values: aiAgentMarketPlaceInfo?.aiAgent
      ? aiAgentMarketPlaceInfo.aiAgent
      : AgentInitial,
  })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return aiAgentMarketPlaceInfo ? (
    <FormProvider {...methods}>
      <TipisWebSocketProvider>
        <AgentWSProvider tabID={tabID!}>
          <MarketplaceInfoProvider marketplaceInfo={aiAgentMarketPlaceInfo}>
            <FormContext>
              <LayoutAutoChange
                desktopPage={
                  <InputVariablesModalProvider>
                    <WorkspacePCHeaderLayout
                      title={aiAgentMarketPlaceInfo.aiAgent.name}
                      extra={<HeaderTools />}
                      customRenderTitle={(title) => (
                        <PCCustomTitle
                          title={title}
                          iconURL={aiAgentMarketPlaceInfo.aiAgent.icon}
                        />
                      )}
                    />
                    <AIAgentRunPC />
                  </InputVariablesModalProvider>
                }
                mobilePage={
                  <>
                    <MobileFirstPageLayout
                      title={aiAgentMarketPlaceInfo.aiAgent.name}
                      headerExtra={
                        <MoreActionButton
                          agentID={aiAgentMarketPlaceInfo.aiAgent.aiAgentID}
                          agentName={aiAgentMarketPlaceInfo.aiAgent.name}
                          publishToMarketplace={
                            aiAgentMarketPlaceInfo.aiAgent
                              .publishedToMarketplace
                          }
                          agentIcon={aiAgentMarketPlaceInfo.aiAgent.icon}
                          isMobile
                        />
                      }
                      customRenderTitle={(title) => (
                        <MobileCustomTitle
                          title={title}
                          iconURL={aiAgentMarketPlaceInfo.aiAgent.icon}
                        />
                      )}
                    >
                      <AIAgentRunMobile />
                    </MobileFirstPageLayout>
                  </>
                }
              />
            </FormContext>
          </MarketplaceInfoProvider>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  ) : null
}
