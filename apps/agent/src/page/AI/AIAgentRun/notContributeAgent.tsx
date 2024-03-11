import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import WorkspaceHeaderLayout from "../../../Layout/Workspace/Header"
import { AgentWSProvider } from "../context/AgentWSContext"
import AIAgentRunPC from "./AIAgentRunPC"
import CustomTitle from "./AIAgentRunPC/components/CustomTitle"
import HeaderTools from "./AIAgentRunPC/components/HeaderTools"
import FormContext from "./AIAgentRunPC/context/FormContext"
import { MarketplaceInfoProvider } from "./contexts/MarketplaceInfoContext"

export const NotContributedAgent: FC = () => {
  const currentTeamID = useSelector(getCurrentId)
  const { agentID } = useParams()

  const { data, isLoading, isError } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: currentTeamID!,
  })

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
      <AgentWSProvider>
        <MarketplaceInfoProvider marketplaceInfo={undefined}>
          <FormContext>
            <LayoutAutoChange
              desktopPage={
                <>
                  <WorkspaceHeaderLayout
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
                  {/* <AIAgentRunMobile agent={data} marketplace={undefined} /> */}
                </>
              }
            />
          </FormContext>
        </MarketplaceInfoProvider>
      </AgentWSProvider>
    </FormProvider>
  ) : null
}
