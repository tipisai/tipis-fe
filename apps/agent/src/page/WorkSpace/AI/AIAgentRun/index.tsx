import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAgentContributeStateQuery } from "@/redux/services/agentAPI"
import { ContributedAgent } from "./contributeAgent"
import { NotContributedAgent } from "./notContributeAgent"

export const AIAgentRun: FC = () => {
  const { agentID, ownerTeamIdentifier } = useParams()

  const { data, isLoading, isError } = useGetAgentContributeStateQuery({
    aiAgentID: agentID!,
    ownerTeamIdentifier: ownerTeamIdentifier!,
  })

  // useEffect(() => {
  //   track(
  //     ILLA_MIXPANEL_EVENT_TYPE.VISIT,
  //     ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
  //   )
  //   trackPageDurationStart()
  //   return () => {
  //     trackPageDurationEnd(ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN)
  //   }
  // }, [])

  // useBeforeUnload(() => {
  //   trackPageDurationEnd(ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN)
  // })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data ? (
    data.isPublishedToMarketplace ? (
      <ContributedAgent />
    ) : (
      <NotContributedAgent />
    )
  ) : null
}

AIAgentRun.displayName = "AIAgentRun"

export default AIAgentRun
