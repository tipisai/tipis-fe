import { getCurrentId } from "@illa-public/user-data"
import { FC } from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import { AIAgent } from "./aiagent"

// import {
//   track,
//   trackPageDurationEnd,
//   trackPageDurationStart,
// } from "@/utils/mixpanelHelper"

export const EditAIAgentPage: FC = () => {
  const { agentID } = useParams()
  const teamID = useSelector(getCurrentId)

  const { data, isLoading, isError } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: teamID!,
  })

  // useEffect(() => {
  //   track(
  //     ILLA_MIXPANEL_EVENT_TYPE.VISIT,
  //     ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
  //   )
  //   trackPageDurationStart()
  //   return () => {
  //     trackPageDurationEnd(ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT)
  //   }
  // }, [])

  // useBeforeUnload(() => {
  //   trackPageDurationEnd(ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT)
  // })

  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />

  return <AIAgent agent={data!} />
}

EditAIAgentPage.displayName = "AIAgentRun"
export default EditAIAgentPage
