import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import { Agent } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"

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

  return data ? (
    <FormProvider {...methods}>
      <AgentWSProvider>
        <FormContext>
          <WorkspacePCHeaderLayout title={data.name} extra={<HeaderTools />} />
          <AIAgent />
        </FormContext>
      </AgentWSProvider>
    </FormProvider>
  ) : null
}

EditAIAgentPage.displayName = "AIAgentRun"
export default EditAIAgentPage
