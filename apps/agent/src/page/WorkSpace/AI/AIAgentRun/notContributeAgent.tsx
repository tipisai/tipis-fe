import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import MobileCustomTitle from "@/Layout/Workspace/mobile/components/CustomTitle"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import PCCustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import MoreActionButton from "./components/MoreActionButton"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const NotContributedAgent: FC = () => {
  const { data, isLoading, isError } = useGetNotContributeTipDetail()
  const methods = useForm<Agent>({
    values: data
      ? {
          ...data,
          variables:
            data.variables.length === 0
              ? [{ key: "", value: "" }]
              : data.variables,
        }
      : undefined,
  })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data ? (
    <FormProvider {...methods}>
      <TipisWebSocketProvider>
        <AgentWSProvider>
          <MarketplaceInfoProvider marketplaceInfo={undefined}>
            <FormContext>
              <LayoutAutoChange
                desktopPage={
                  <>
                    <WorkspacePCHeaderLayout
                      title={data.name}
                      extra={<HeaderTools />}
                      customRenderTitle={(title) => (
                        <PCCustomTitle title={title} iconURL={data.icon} />
                      )}
                    />
                    <AIAgentRunPC />
                  </>
                }
                mobilePage={
                  <>
                    <MobileFirstPageLayout
                      headerExtra={
                        <MoreActionButton
                          agentID={data.aiAgentID}
                          agentName={data.name}
                          publishToMarketplace={data.publishedToMarketplace}
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
