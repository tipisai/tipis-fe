import { App } from "antd"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { isPremiumModel } from "@illa-public/market-agent"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo, getCurrentUser } from "@illa-public/user-data"
import { sendTagEvent } from "@illa-public/utils"
import {
  useCreateAgentMutation,
  useGetAgentIconUploadAddressMutation,
  usePutAgentDetailMutation,
} from "@/redux/services/agentAPI"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { fetchUploadBase64 } from "@/utils/file"
import { updateUiHistoryData } from "@/utils/localForage/teamData"
import { track } from "@/utils/mixpanelHelper"
import {
  useCreateTipiToEditTipi,
  useUpdateRecentTabReducer,
} from "@/utils/recentTabs/hook"
import { IAgentForm } from "./interface"

export const agentData2JSONReport = (agent: IAgentForm) => {
  try {
    const {
      agentType,
      modelConfig: {},
      model,
    } = agent

    return JSON.stringify({
      mode: agentType,
      model,
    })
  } catch (e) {
    return JSON.stringify({})
  }
}

export const handleScrollToElement = (scrollId: string) => {
  const el = document.querySelector(`[data-scroll-id=${scrollId}]`)
  setTimeout(() => {
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, 30)
}

export const useSubmitSaveAgent = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const [getAgentIconUploadAddress] = useGetAgentIconUploadAddressMutation()
  const [putAgentDetail] = usePutAgentDetailMutation()
  const [createAgent] = useCreateAgentMutation()
  const changeCreateToEdit = useCreateTipiToEditTipi()

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const currentUserInfo = useSelector(getCurrentUser)
  const { reset } = useFormContext<IAgentForm>()
  const updateTabInfo = useUpdateRecentTabReducer()

  const handleSubmitSave = useCallback(
    async (data: IAgentForm) => {
      let currentData: IAgentForm = { ...data }
      if (
        !isPremiumModel(currentData.model) &&
        currentData.knowledge?.length > 0
      ) {
        currentData = {
          ...currentData,
          knowledge: [],
        }
      }
      track(
        ILLA_MIXPANEL_EVENT_TYPE.CLICK,
        ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
        {
          element: "save",
          parameter1: agentData2JSONReport(currentData),
          parameter5: currentData.aiAgentID || "-1",
        },
      )
      let agentInfo: Agent
      try {
        let updateIconURL = currentData.icon
        if (currentData.icon !== undefined && currentData.icon !== "") {
          const iconURL = new URL(currentData.icon)
          if (iconURL.protocol !== "http:" && iconURL.protocol !== "https:") {
            const responseData = await getAgentIconUploadAddress({
              teamID: currentTeamInfo.id,
              base64: currentData.icon,
            }).unwrap()
            updateIconURL = await fetchUploadBase64(
              responseData.uploadAddress,
              currentData.icon,
            )
          }
        }
        if (
          currentData.aiAgentID === undefined ||
          currentData.aiAgentID === ""
        ) {
          const serverAgent = await createAgent({
            teamID: currentTeamInfo.id,
            agentRaw: {
              ...currentData,
              icon: updateIconURL,
              variables: currentData.variables.filter(
                (v) => v.key !== "" && v.value !== "",
              ),
            },
          }).unwrap()
          changeCreateToEdit(currentData.cacheID, serverAgent.aiAgentID)
          sendTagEvent("create_agent", currentUserInfo.userID)
          agentInfo = serverAgent
        } else {
          const serverAgent = await putAgentDetail({
            teamID: currentTeamInfo.id,
            aiAgentID: currentData.aiAgentID,
            agentRaw: {
              ...currentData,
              icon: updateIconURL,
              variables: data.variables.filter(
                (v) => v.key !== "" && v.value !== "",
              ),
            },
          }).unwrap()
          agentInfo = serverAgent
        }
        const newFormData: Agent = {
          ...agentInfo,
          variables:
            agentInfo.variables.length === 0
              ? [{ key: "", value: "" }]
              : agentInfo.variables,
          knowledge: Array.isArray(agentInfo.knowledge)
            ? agentInfo.knowledge
            : [],
        }
        reset(newFormData)
        updateTabInfo(data.cacheID, {
          tabName: newFormData.name,
          tabIcon: newFormData.icon,
          tabType: TAB_TYPE.EDIT_TIPIS,
          cacheID: newFormData.aiAgentID,
        })

        updateUiHistoryData(
          currentTeamInfo.id,
          data.cacheID,
          newFormData.aiAgentID,
          {
            formData: newFormData,
          },
        )
        message.success({
          content: t("dashboard.message.create-suc"),
        })
      } catch (e) {
        message.error({
          content: t("dashboard.message.create-failed"),
        })
        throw e
      }
    },
    [
      changeCreateToEdit,
      createAgent,
      currentTeamInfo.id,
      currentUserInfo.userID,
      getAgentIconUploadAddress,
      message,
      putAgentDetail,
      reset,
      t,
      updateTabInfo,
    ],
  )

  return handleSubmitSave
}
