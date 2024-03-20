import { FC } from "react"
import { Navigate } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetTipiContributed } from "@/utils/tipis/hook"
import { ContributedAgent } from "./contributeAgent"
import { NotContributedAgent } from "./notContributeAgent"

export const AIAgentRun: FC = () => {
  const { data, isLoading, isError } = useGetTipiContributed()

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
