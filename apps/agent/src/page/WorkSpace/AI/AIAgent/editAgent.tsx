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
import store from "@/redux/store"
import {
  getUiHistoryDataByCacheID,
  setUiHistoryData,
} from "@/utils/localForage/teamData"
import { useAddEditTipisTab } from "@/utils/recentTabs/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
import { UploadContextProvider } from "./components/UploadContext"
import { AgentInitial, IAgentForm } from "./interface"

export const EditAIAgentPage: FC = () => {
  const { agentID } = useParams()
  const teamID = useSelector(getCurrentId)

  const { data, isLoading, isError } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: teamID!,
  })

  const addEditTipiTab = useAddEditTipisTab()

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
        }
      : initAgent,
  })

  const isDirty = methods.formState.isDirty

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
            ...(values as IAgentForm),
            formIsDirty: isDirty,
          },
        })
      }
    } else {
      if (values.aiAgentID) {
        setUiHistoryData(teamID!, cacheID!, {
          formData: {
            ...(values as IAgentForm),
            formIsDirty: isDirty,
          },
        })
      }
    }
  }, [isDirty, teamID, values])
  const { reset } = methods

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      const cacheID = values.aiAgentID!
      const teamID = getCurrentId(store.getState())!
      const uiHistoryData = await getUiHistoryDataByCacheID(teamID, cacheID)
      if (uiHistoryData) {
        const { formData } = uiHistoryData
        if (formData) {
          reset(
            {
              ...formData,
              cacheID: (formData as IAgentForm).aiAgentID,
            },
            {
              keepDirty: true,
            },
          )
        }
      }
    }
    getHistoryDataAndSetFormData()
  }, [reset, values.aiAgentID])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    return () => {
      setUiHistoryFormData()
    }
  }, [setUiHistoryFormData])

  useEffect(() => {
    if (agentID) {
      addEditTipiTab(agentID)
    }
  }, [agentID, addEditTipiTab])

  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />

  return data ? (
    <FormProvider {...methods}>
      <TipisWebSocketProvider key={agentID}>
        <AgentWSProvider>
          <FormContext>
            <UploadContextProvider>
              <LayoutAutoChange
                desktopPage={
                  <WorkspacePCHeaderLayout
                    title={data.name}
                    extra={<HeaderTools />}
                  />
                }
              />
              <AIAgent />
            </UploadContextProvider>
          </FormContext>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  ) : null
}

EditAIAgentPage.displayName = "AIAgentRun"
export default EditAIAgentPage
