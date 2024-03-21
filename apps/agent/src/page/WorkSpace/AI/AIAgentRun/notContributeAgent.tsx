import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import CustomTitle from "@/Layout/Workspace/pc/components/CustomTitle"
import WorkspaceMobileHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import MobileMoreActionButton from "./AIAgentRunMobile/components/MoreActionButton"
import AIAgentRunPC from "./AIAgentRunPC"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
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
                        <CustomTitle title={title} iconURL={data.icon} />
                      )}
                    />
                    <AIAgentRunPC />
                  </>
                }
                mobilePage={
                  <>
                    <WorkspaceMobileHeaderLayout
                      title={data.name}
                      extra={<MobileMoreActionButton />}
                      customRenderTitle={(title) => (
                        <CustomTitle title={title} iconURL={data.icon} />
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
