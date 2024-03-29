import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { TipisWebSocketProvider } from "@/components/PreviewChat/TipisWebscoketContext"
import store from "@/redux/store"
import {
  getUiHistoryDataByCacheID,
  setUiHistoryData,
} from "@/utils/localForage/teamData"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"
import { useAddCreateTipisTab } from "@/utils/recentTabs/hook"
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

export const CreateAIAgentPage: FC = () => {
  const createTipiTab = useAddCreateTipisTab()

  useEffect(() => {
    createTipiTab()
  }, [createTipiTab])

  const methods = useForm<IAgentForm>({
    values: {
      ...AgentInitial,
      cacheID: CREATE_TIPIS_ID!,
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
    const cacheID = CREATE_TIPIS_ID
    const teamID = getCurrentId(store.getState())!
    const uiHistoryData = await getUiHistoryDataByCacheID(teamID, cacheID)
    if (uiHistoryData) {
      const { formData } = uiHistoryData
      setUiHistoryData(teamID, cacheID!, {
        ...uiHistoryData,
        formData: {
          ...(formData as IAgentForm),
          ...(values as IAgentForm),
        },
      })
    } else {
      setUiHistoryData(teamID, cacheID!, {
        formData: values as IAgentForm,
      })
    }
  }, [values])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      const cacheID = CREATE_TIPIS_ID
      const teamID = getCurrentId(store.getState())!
      const uiHistoryData = await getUiHistoryDataByCacheID(teamID, cacheID)
      if (uiHistoryData) {
        const { formData } = uiHistoryData
        if (formData) {
          methods.reset(formData as IAgentForm)
        }
      }
    }
    getHistoryDataAndSetFormData()
  }, [methods])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    return () => {
      setUiHistoryFormData()
    }
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods}>
      <TipisWebSocketProvider key={CREATE_TIPIS_ID}>
        <AgentWSProvider>
          <FormContext>
            <LayoutAutoChange
              desktopPage={
                <WorkspacePCHeaderLayout
                  title={t("dashboard.button.blank-agent")}
                  extra={<HeaderTools />}
                />
              }
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
