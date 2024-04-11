import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/teamData"
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

  const { reset, control } = methods
  const values = useWatch({
    control,
  })

  const { t } = useTranslation()

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
      const tabID = CREATE_TIPIS_ID
      const teamID = getCurrentId(store.getState())!
      const formData = await getFormDataByTabID(teamID, tabID)
      if (formData) {
        reset(formData)
      }
    }
    getHistoryDataAndSetFormData()
  }, [reset])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    setUiHistoryFormData()
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods} key={CREATE_TIPIS_ID}>
      <TipisWebSocketProvider>
        <AgentWSProvider>
          <FormContext>
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
          </FormContext>
        </AgentWSProvider>
      </TipisWebSocketProvider>
    </FormProvider>
  )
}

CreateAIAgentPage.displayName = "AIAgentRun"
export default CreateAIAgentPage
