import { getCurrentTeamInfo } from "@illa-public/user-data"
import { FC } from "react"
import { useSelector } from "react-redux"
import { AIAgent } from "@/page/AI/AIAgent/aiagent"
import { AgentInitial } from "./interface"

// import {
//   track,
//   trackPageDurationEnd,
//   trackPageDurationStart,
// } from "@/utils/mixpanelHelper"

export const CreateAIAgentPage: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const agent = {
    ...AgentInitial,
    teamID: currentTeamInfo.id,
    teamIdentifier: currentTeamInfo.identifier,
    teamIcon: currentTeamInfo.icon,
  }
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

  return <AIAgent agent={agent} />
}

CreateAIAgentPage.displayName = "AIAgentRun"
export default CreateAIAgentPage
