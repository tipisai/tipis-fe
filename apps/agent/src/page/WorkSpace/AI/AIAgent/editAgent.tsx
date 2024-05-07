import { FC, useCallback, useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { useBeforeUnload, useParams, useSearchParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Agent } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
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
import EmptyTipis from "../components/EmptyTipis"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
import { UploadContextProvider } from "./components/UploadContext"
import { IAgentForm } from "./interface"
import { mergeDefaultValueData } from "./utils"

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

  if (isError) return <EmptyTipis tipisID={agentID!} />
  if (isLoading) return <FullSectionLoading />

  return data ? (
    <EditAIAgentPage
      originAgent={mergeDefaultValueData(data)}
      cacheData={cacheData}
    />
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
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = historyTabs.find(
    (tab) => tab.cacheID === agentID && tab.tabType === TAB_TYPE.EDIT_TIPIS,
  )

  const canReadCacheRef = useRef(true)

  const methods = useForm<IAgentForm>({
    defaultValues: originAgent,
  })

  const { control, reset } = methods

  const handleRedirectToolInfo = useCallback(
    (formData: IAgentForm) => {
      const aiToolID = searchParams.get("aiToolID")
      const aiToolName = searchParams.get("aiToolName")
      const aiToolIcon = searchParams.get("aiToolIcon")
      const { aiTools = [] } = formData
      if (aiToolID && aiToolIcon && aiToolName) {
        searchParams.delete("aiToolID")
        searchParams.delete("aiToolName")
        searchParams.delete("aiToolIcon")
        setSearchParams(searchParams)
        const targetAiToolIndex = aiTools.findIndex(
          (item) => item.aiToolID === aiToolID,
        )
        if (targetAiToolIndex !== -1) {
          aiTools[targetAiToolIndex] = {
            ...aiTools[targetAiToolIndex],
            name: aiToolName,
            config: {
              icon: aiToolIcon,
            },
          }
        } else {
          aiTools.push({
            aiToolID,
            name: aiToolName,
            config: {
              icon: aiToolIcon,
            },
          })
        }
      }
      return aiTools
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    if (cacheData && canReadCacheRef.current) {
      canReadCacheRef.current = false
      const aiTools = handleRedirectToolInfo(cacheData as IAgentForm)
      reset(
        {
          ...cacheData,
          aiTools,
        },
        {
          keepDefaultValues: true,
        },
      )
    }
  }, [cacheData, handleRedirectToolInfo, reset])

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
            <PreviewChatUseProvider useTo={PREVIEW_CHAT_USE_TO.EDIT_TIPI}>
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
            </PreviewChatUseProvider>
          </FormContext>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  )
}

EditAIAgentGetValuePage.displayName = "EditAIAgentGetValuePage"
export default EditAIAgentGetValuePage
