import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useBeforeUnload, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import {
  getFormDataByTabID,
  setFormDataByTabID,
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

  const methods = useForm<IAgentForm>({
    values: data
      ? {
          ...data,
        }
      : AgentInitial,
  })

  const { getValues, reset } = methods
  const isDirty = methods.formState.isDirty

  const setUiHistoryFormData = useCallback(async () => {
    const values = getValues()
    if (!agentID) return
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTab = historyTabs.find((tab) => tab.cacheID === agentID)
    if (!currentTab) return
    const formData = await getFormDataByTabID(teamID!, currentTab.tabID)
    if (formData) {
      await setFormDataByTabID(teamID!, currentTab.tabID, {
        ...formData,
        ...values,
        formIsDirty: isDirty,
      })
    } else {
      await setFormDataByTabID(teamID!, currentTab.tabID, {
        ...values,
        formIsDirty: isDirty,
      })
    }
  }, [agentID, getValues, isDirty, teamID])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      if (!agentID) return
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTab = historyTabs.find((tab) => tab.cacheID === agentID)
      if (!currentTab) return
      const teamID = getCurrentId(store.getState())!
      const formData = await getFormDataByTabID(teamID, currentTab.tabID)
      if (formData) {
        reset(formData, {
          keepDirty: true,
        })
      }
    }
    getHistoryDataAndSetFormData()
  }, [agentID, reset])

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
