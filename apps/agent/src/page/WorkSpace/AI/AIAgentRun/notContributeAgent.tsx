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
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import { AgentInitial, IAgentForm } from "../AIAgent/interface"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import { InputVariablesModalProvider } from "./AIAgentRunPC/context/InputVariablesModalContext"
import MoreActionButton from "./components/MoreActionButton"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const NotContributedAgent: FC = () => {
  const { data, isLoading, isError, isSuccess } = useGetNotContributeTipDetail()
  const methods = useForm<IAgentForm>({
    values: data ? data : AgentInitial,
  })

  const { tabID } = useParams()

  const addAgentRunTab = useAddRunTipisTab()

  useEffect(() => {
    if (data && tabID) {
      addAgentRunTab(
        {
          tipisID: data.aiAgentID,
          tipisIcon: data.icon,
          tipisName: data.name,
        },
        tabID,
      )
    }
  }, [addAgentRunTab, data, tabID])

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data && isSuccess ? (
    <FormProvider {...methods}>
      <TipisWebSocketProvider>
        <AgentWSProvider>
          <MarketplaceInfoProvider marketplaceInfo={undefined}>
            <FormContext>
              <LayoutAutoChange
                desktopPage={
                  <InputVariablesModalProvider>
                    <WorkspacePCHeaderLayout
                      title={data.name}
                      extra={<HeaderTools />}
                      customRenderTitle={(title) => (
                        <PCCustomTitle title={title} iconURL={data.icon} />
                      )}
                    />
                    <AIAgentRunPC />
                  </InputVariablesModalProvider>
                }
                mobilePage={
                  <>
                    <MobileFirstPageLayout
                      headerExtra={
                        <MoreActionButton
                          agentID={data.aiAgentID}
                          agentName={data.name}
                          publishToMarketplace={data.publishedToMarketplace}
                          agentIcon={data.icon}
                          isMobile
                        />
                      }
                      customRenderTitle={(title) => (
                        <MobileCustomTitle title={title} iconURL={data.icon} />
                      )}
                      title={data.name}
                    >
                      {/* <WorkspaceMobileHeaderLayout
                        title={data.name}
                        extra={}
                      /> */}
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
