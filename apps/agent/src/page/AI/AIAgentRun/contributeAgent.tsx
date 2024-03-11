import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Navigate, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetContributedAgentDetailQuery } from "@/redux/services/agentAPI"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import WorkspaceHeaderLayout from "../../../Layout/Workspace/Header"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"
import CustomTitle from "./AIAgentRunPC/components/CustomTitle"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const ContributedAgent: FC = () => {
  const { agentID, ownerTeamIdentifier } = useParams()

  const {
    data: contributeAgentDetail,
    isLoading: isGetContributedAgentDetailLoading,
    isError: isGetContributedAgentDetailError,
  } = useGetContributedAgentDetailQuery({
    aiAgentID: agentID!,
    ownerTeamIdentifier: ownerTeamIdentifier!,
  })

  const {
    data: aiAgentMarketPlaceInfo,
    isLoading: isGetAIAgentMarketplaceInfoLoading,
    isError: isGetAIAgentMarketplaceInfoError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })

  const mixedIsLoading =
    isGetContributedAgentDetailLoading || isGetAIAgentMarketplaceInfoLoading
  const mixedIsError =
    isGetContributedAgentDetailError || isGetAIAgentMarketplaceInfoError

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

  if (mixedIsLoading) {
    return <FullSectionLoading />
  }

  if (mixedIsError) {
    return <Navigate to="/404" />
  }

  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <FormProvider {...methods}>
      <AgentWSProvider>
        <MarketplaceInfoProvider marketplaceInfo={aiAgentMarketPlaceInfo}>
          <FormContext>
            <LayoutAutoChange
              desktopPage={
                <>
                  <WorkspaceHeaderLayout
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
                  <AIAgentRunMobile />
                </>
              }
            />
          </FormContext>
        </MarketplaceInfoProvider>
      </AgentWSProvider>
    </FormProvider>
  ) : null
}
