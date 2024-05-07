import { FC, useCallback, useEffect, useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload, useSearchParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { PreviewChatUseProvider } from "@/components/PreviewChat/PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "@/components/PreviewChat/PreviewChatUseContext/constants"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/formData"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"
import { useAddCreateTipisTab } from "@/utils/recentTabs/hook"
import { AgentWSProvider } from "../context/AgentWSContext"
import { AIAgent } from "./aiagent"
import FormContext from "./components/FormContext"
import HeaderTools from "./components/HeaderTools"
import { UploadContextProvider } from "./components/UploadContext"
import { AgentInitial, IAgentForm } from "./interface"

export const CreateAIAgentPage: FC = () => {
  const createTipiTab = useAddCreateTipisTab()

  useEffect(() => {
    createTipiTab()
  }, [createTipiTab])

  const methods = useForm<IAgentForm>({
    defaultValues: AgentInitial,
  })

  const canReadCacheRef = useRef(true)

  const { reset, control } = methods
  const values = useWatch({
    control,
  })

  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

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

  const setUiHistoryFormData = useCallback(async () => {
    const tabID = CREATE_TIPIS_ID
    const teamID = getCurrentId(store.getState())!
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTab = historyTabs.find((tab) => tab.tabID === tabID)
    if (!currentTab) return
    const formData = await getFormDataByTabID(teamID, tabID)
    if (formData) {
      await setFormDataByTabID(teamID, tabID, {
        ...formData,
        ...values,
      })
    } else {
      await setFormDataByTabID(teamID, tabID, values)
    }
  }, [values])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      canReadCacheRef.current = false
      const tabID = CREATE_TIPIS_ID
      const teamID = getCurrentId(store.getState())!
      const formData = await getFormDataByTabID(teamID, tabID)
      if (formData) {
        const aiTools = handleRedirectToolInfo(formData as IAgentForm)
        reset({
          ...formData,
          aiTools,
        })
      }
    }
    canReadCacheRef.current && getHistoryDataAndSetFormData()
  }, [handleRedirectToolInfo, reset, searchParams])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    setUiHistoryFormData()
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods} key={CREATE_TIPIS_ID}>
      <TipisWebSocketProvider>
        <AgentWSProvider tabID={CREATE_TIPIS_ID}>
          <FormContext>
            <PreviewChatUseProvider useTo={PREVIEW_CHAT_USE_TO.CREATE_TIPI}>
              <UploadContextProvider>
                <LayoutAutoChange
                  desktopPage={
                    <WorkspacePCHeaderLayout
                      title={t("dashboard.button.blank-agent")}
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

CreateAIAgentPage.displayName = "AIAgentRun"
export default CreateAIAgentPage
