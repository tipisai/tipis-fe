import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetTipiContributed } from "@/utils/tipis/hook"
import { ContributedAgent } from "./contributeAgent"
import { NotContributedAgent } from "./notContributeAgent"

export const AIAgentRun: FC = () => {
  const { tabID } = useParams()
  const { data, isLoading, isError, agentID } = useGetTipiContributed()

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data ? (
    data.isPublishedToMarketplace ? (
      <ContributedAgent key={`${agentID}-${tabID}`} />
    ) : (
      <NotContributedAgent key={`${agentID}-${tabID}`} />
    )
  ) : null
}

AIAgentRun.displayName = "AIAgentRun"

export default AIAgentRun
