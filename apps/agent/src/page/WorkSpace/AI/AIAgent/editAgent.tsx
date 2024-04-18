import { FC, useCallback, useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate, useBeforeUnload, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/formData"
import { useAddOrUpdateEditTipisTab } from "@/utils/recentTabs/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
import { UploadContextProvider } from "./components/UploadContext"
import { IAgentForm } from "./interface"

const EditAIAgentGetValuePage: FC = () => {
  const { agentID } = useParams()
  const teamID = useSelector(getCurrentId)

  const { data, isLoading, isError } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: teamID!,
  })
  const addEditTipiTab = useAddOrUpdateEditTipisTab()

  useEffect(() => {
    if (data) {
      addEditTipiTab({
        tipisID: data.aiAgentID,
        tipisName: data.name,
      })
    }
  }, [addEditTipiTab, data])

  const [cacheData, setCacheData] = useState<undefined | Agent>(undefined)

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      if (!agentID) return
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTab = historyTabs.find(
        (tab) => tab.cacheID === agentID && tab.tabType === TAB_TYPE.EDIT_TIPIS,
      )
      if (!currentTab) return
      const teamID = getCurrentId(store.getState())!
      const formData = (await getFormDataByTabID(teamID, currentTab.tabID)) as
        | Agent
        | undefined

      if (formData) {
        setCacheData(formData)
      }
    }
    getHistoryDataAndSetFormData()
  }, [agentID])

  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />

  return data ? (
    <EditAIAgentPage originAgent={data} cacheData={cacheData} />
  ) : null
}

const EditAIAgentPage: FC<{
  cacheData: Agent | undefined
  originAgent: Agent
}> = (props) => {
  const { originAgent, cacheData } = props
  const { agentID } = useParams()
  const teamID = useSelector(getCurrentId)
  const historyTabs = useSelector(getRecentTabInfos)
  const currentTab = historyTabs.find(
    (tab) => tab.cacheID === agentID && tab.tabType === TAB_TYPE.EDIT_TIPIS,
  )

  const methods = useForm<IAgentForm>({
    defaultValues: originAgent,
  })

  const { control, reset } = methods

  useEffect(() => {
    if (cacheData) {
      reset(cacheData, {
        keepDefaultValues: true,
      })
    }
  }, [cacheData, reset])

  const values = useWatch({
    control,
  })

  const setUiHistoryFormData = useCallback(async () => {
    if (!agentID) return
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTab = historyTabs.find((tab) => tab.cacheID === agentID)
    if (!currentTab) return
    const formData = await getFormDataByTabID(teamID!, currentTab.tabID)
    if (formData) {
      await setFormDataByTabID(teamID!, currentTab.tabID, {
        ...formData,
        ...values,
      })
    } else {
      await setFormDataByTabID(teamID!, currentTab.tabID, {
        ...values,
      })
    }
  }, [agentID, teamID, values])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    setUiHistoryFormData()
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods} key={agentID}>
      <TipisWebSocketProvider>
        <AgentWSProvider tabID={currentTab?.tabID ?? ""}>
          <FormContext>
            <UploadContextProvider>
              <LayoutAutoChange
                desktopPage={
                  <WorkspacePCHeaderLayout
                    title={values.name!}
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
  )
}

EditAIAgentGetValuePage.displayName = "EditAIAgentGetValuePage"
export default EditAIAgentGetValuePage
