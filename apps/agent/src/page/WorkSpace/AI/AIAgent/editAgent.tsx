import { FC, useCallback, useEffect, useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useBeforeUnload, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import {
  getUiHistoryDataByCacheID,
  setUiHistoryData,
} from "@/utils/localForage/teamData"
import store from "../../../../redux/store"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
import { AgentInitial, IAgentForm } from "./interface"

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

  const initAgent = useMemo(
    () => ({
      ...AgentInitial,
      cacheID: agentID!,
    }),
    [agentID],
  )

  const methods = useForm<IAgentForm>({
    values: data
      ? {
          ...data,
          cacheID: data.aiAgentID,
          variables:
            data.variables.length === 0
              ? [{ key: "", value: "" }]
              : data.variables,
          knowledge: Array.isArray(data.knowledge) ? data.knowledge : [],
        }
      : initAgent,
  })

  const values = useWatch({
    control: methods.control,
  })

  const setUiHistoryFormData = useCallback(async () => {
    const cacheID = values.cacheID!
    const uiHistoryData = await getUiHistoryDataByCacheID(teamID!, cacheID)

    if (uiHistoryData) {
      const { formData } = uiHistoryData
      if (values.aiAgentID) {
        setUiHistoryData(teamID!, cacheID!, {
          ...uiHistoryData,
          formData: {
            ...(formData as IAgentForm),
            ...values,
          },
        })
      }
    } else {
      if (values.aiAgentID) {
        setUiHistoryData(teamID!, cacheID!, {
          formData: values,
        })
      }
    }
  }, [teamID, values])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      const cacheID = values.aiAgentID!
      const teamID = getCurrentId(store.getState())!
      const uiHistoryData = await getUiHistoryDataByCacheID(teamID, cacheID)
      if (uiHistoryData) {
        const { formData } = uiHistoryData
        if (formData) {
          methods.reset({
            ...formData,
            cacheID: (formData as IAgentForm).aiAgentID,
          })
        }
      }
    }
    getHistoryDataAndSetFormData()
  }, [methods, values.aiAgentID])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    return () => {
      setUiHistoryFormData()
    }
  }, [setUiHistoryFormData])

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
      <TipisWebSocketProvider key={agentID}>
        <AgentWSProvider>
          <FormContext>
            <LayoutAutoChange
              desktopPage={
                <WorkspacePCHeaderLayout
                  title={data.name}
                  extra={<HeaderTools />}
                />
              }
            />
            <AIAgent />
          </FormContext>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  ) : null
}

EditAIAgentPage.displayName = "AIAgentRun"
export default EditAIAgentPage
