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
import { useAddRunTipisTab } from "@/utils/recentTabs/hook"
import { useGetTipiContributedDetail } from "@/utils/tipis/hook"
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
  const { contributeAgentDetail, isError, isLoading, aiAgentMarketPlaceInfo } =
    useGetTipiContributedDetail()
  const { tabID } = useParams()

  const addAgentRunTab = useAddRunTipisTab()

  useEffect(() => {
    if (contributeAgentDetail && tabID) {
      addAgentRunTab(
        {
          tipisID: contributeAgentDetail.aiAgentID,
          tipisIcon: contributeAgentDetail.icon,
          tipisName: contributeAgentDetail.name,
        },
        tabID,
      )
    }
  }, [addAgentRunTab, contributeAgentDetail, tabID])

  const methods = useForm<IAgentForm>({
    values: contributeAgentDetail ? contributeAgentDetail : AgentInitial,
  })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <FormProvider {...methods}>
      <TipisWebSocketProvider>
        <AgentWSProvider tabID={tabID!}>
          <MarketplaceInfoProvider marketplaceInfo={aiAgentMarketPlaceInfo}>
            <FormContext>
              <LayoutAutoChange
                desktopPage={
                  <InputVariablesModalProvider>
                    <WorkspacePCHeaderLayout
                      title={contributeAgentDetail.name}
                      extra={<HeaderTools />}
                      customRenderTitle={(title) => (
                        <PCCustomTitle
                          title={title}
                          iconURL={contributeAgentDetail.icon}
                        />
                      )}
                    />
                    <AIAgentRunPC />
                  </InputVariablesModalProvider>
                }
                mobilePage={
                  <>
                    <MobileFirstPageLayout
                      title={contributeAgentDetail.name}
                      headerExtra={
                        <MoreActionButton
                          agentID={contributeAgentDetail.aiAgentID}
                          agentName={contributeAgentDetail.name}
                          publishToMarketplace={
                            contributeAgentDetail.publishedToMarketplace
                          }
                          agentIcon={contributeAgentDetail.icon}
                          isMobile
                        />
                      }
                      customRenderTitle={(title) => (
                        <MobileCustomTitle
                          title={title}
                          iconURL={contributeAgentDetail.icon}
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
