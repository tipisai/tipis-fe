import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import WorkspaceMobileHeaderLayout from "@/Layout/Workspace/mobile/Header"
import CustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetTipiContributedDetail } from "@/utils/tipis/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import MobileMoreActionButton from "./AIAgentRunMobile/components/MoreActionButton"
import AIAgentRunPC from "./AIAgentRunPC"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const ContributedAgent: FC = () => {
  const { contributeAgentDetail, isError, isLoading, aiAgentMarketPlaceInfo } =
    useGetTipiContributedDetail()

  const methods = useForm<Agent>({
    values: contributeAgentDetail
      ? {
          ...contributeAgentDetail,
          variables:
            contributeAgentDetail.variables.length === 0
              ? [{ key: "", value: "" }]
              : contributeAgentDetail.variables,
        }
      : undefined,
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
        <AgentWSProvider>
          <MarketplaceInfoProvider marketplaceInfo={aiAgentMarketPlaceInfo}>
            <FormContext>
              <LayoutAutoChange
                desktopPage={
                  <>
                    <WorkspacePCHeaderLayout
                      title={contributeAgentDetail.name}
                      extra={<HeaderTools />}
                      customRenderTitle={(title) => (
                        <CustomTitle
                          title={title}
                          iconURL={contributeAgentDetail.icon}
                        />
                      )}
                    />
                    <AIAgentRunPC />
                  </>
                }
                mobilePage={
                  <>
                    <WorkspaceMobileHeaderLayout
                      title={contributeAgentDetail.name}
                      extra={<MobileMoreActionButton />}
                      customRenderTitle={(title) => (
                        <CustomTitle
                          title={title}
                          iconURL={contributeAgentDetail.icon}
                        />
                      )}
                    />
                    <AIAgentRunMobile />
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
