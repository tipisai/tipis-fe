import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useBeforeUnload, useParams } from "react-router-dom"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import {
  getUiHistoryDataByCacheID,
  setUiHistoryData,
} from "@/utils/localForage/uiHistoryStore"
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
  const { agentID } = useParams()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const agent = {
    ...AgentInitial,
    agentID: agentID!,
    teamID: currentTeamInfo.id,
    teamIdentifier: currentTeamInfo.identifier,
    teamIcon: currentTeamInfo.icon,
  }

  const methods = useForm<Agent>({
    values: {
      ...agent,
      variables:
        agent.variables.length === 0
          ? [{ key: "", value: "" }]
          : agent.variables,
    },
  })

  const values = useWatch({
    control: methods.control,
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

  const setUiHistoryFormData = useCallback(async () => {
    const cacheID = agent.agentID
    const uiHistoryData = await getUiHistoryDataByCacheID(cacheID)
    console.log("oldValues", values)
    if (uiHistoryData) {
      const { formData } = uiHistoryData
      setUiHistoryData(cacheID!, {
        ...uiHistoryData,
        formData: {
          ...(formData as Agent),
          ...values,
        },
      })
    } else {
      setUiHistoryData(cacheID!, {
        formData: values,
      })
    }
  }, [agent.agentID, values])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      const cacheID = agent.agentID
      const uiHistoryData = await getUiHistoryDataByCacheID(cacheID)
      if (uiHistoryData) {
        const { formData } = uiHistoryData
        if (formData) {
          methods.reset(formData as Agent)
        }
      }
    }
    getHistoryDataAndSetFormData()
  }, [agent.agentID, methods])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    return () => {
      setUiHistoryFormData()
    }
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods}>
      <TipisWebSocketProvider>
        <AgentWSProvider>
          <FormContext>
            <WorkspacePCHeaderLayout
              title={t("new_dashboard.button.blank-agent")}
              extra={<HeaderTools />}
            />
            <AIAgent />
          </FormContext>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  )
}

CreateAIAgentPage.displayName = "AIAgentRun"
export default CreateAIAgentPage
