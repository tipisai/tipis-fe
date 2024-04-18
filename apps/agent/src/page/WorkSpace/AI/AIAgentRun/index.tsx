import { FC } from "react"
import { useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetTipiContributed } from "@/utils/tipis/hook"
import EmptyTipis from "../components/EmptyTipis"
import { ContributedAgent } from "./contributeAgent"
import { NotContributedAgent } from "./notContributeAgent"

export const AIAgentRun: FC = () => {
  const { tabID, agentID } = useParams()
  const { data, isLoading, isError } = useGetTipiContributed()

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <EmptyTipis tipisID={agentID!} />
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
