import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/Header"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
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
  const methods = useForm<Agent>({
    defaultValues: {
      ...agent,
      variables:
        agent.variables.length === 0
          ? [{ key: "", value: "" }]
          : agent.variables,
    },
  })

  const { t } = useTranslation()
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

  return (
    <FormProvider {...methods}>
      <AgentWSProvider>
        <FormContext>
          <WorkspacePCHeaderLayout
            title={t("new_dashboard.button.blank-agent")}
            extra={<HeaderTools />}
          />
          <AIAgent />
        </FormContext>
      </AgentWSProvider>
    </FormProvider>
  )
}

CreateAIAgentPage.displayName = "AIAgentRun"
export default CreateAIAgentPage
