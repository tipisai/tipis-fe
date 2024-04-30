import { App } from "antd"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  Agent,
  AgentRaw,
  IScheduleDTO,
  ITriggerConfigDTO,
} from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import {
  useCreateAgentMutation,
  useGetAgentIconUploadAddressMutation,
  usePutAgentDetailMutation,
} from "@/redux/services/agentAPI"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { fetchUploadBase64 } from "@/utils/file"
import { deleteFormDataByTabID } from "@/utils/localForage/formData"
import { useBatchUpdateRecentTabReducer } from "@/utils/recentTabs/baseHook"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"
import { useUpdateCreateTipiTabToEditTipiTab } from "@/utils/recentTabs/hook"
import { AgentInitial, IAgentForm, INIT_TRIGGER_CONFIG } from "./interface"

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
  const updateCreateTipiTabToEditTipiTab = useUpdateCreateTipiTabToEditTipiTab()
  const batchUpdateTabInfo = useBatchUpdateRecentTabReducer()

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { reset } = useFormContext<IAgentForm>()

  const getAgentRowData = useCallback((formData: IAgentForm): AgentRaw => {
    const scheduleVO = formData.triggerConfig?.schedule ?? []
    const schedules: IScheduleDTO[] = scheduleVO.map((item) => ({
      name: "",
      contentID: "",
      triggerType: "schedule",
      ...item,
    }))
    const triggerConfig: ITriggerConfigDTO = {
      poll: [],
      webhook: [],
      schedule: schedules,
    }
    return {
      name: formData.name,
      agentType: formData.agentType,
      model: formData.model,
      variables: formData.variables.filter(
        (v) => v.key !== "" && v.value !== "",
      ),
      prompt: formData.prompt,
      modelConfig: formData.modelConfig,
      description: formData.description,
      icon: formData.icon,
      knowledge: formData.knowledge,
      aiToolIDs: formData.aiTools.map((item) => item.aiToolID),
      triggerIsActive: formData.triggerIsActive,
      triggerConfig,
    }
  }, [])

  const handleCreateAgent = useCallback(
    async (currentData: IAgentForm) => {
      const agentRawData = getAgentRowData(currentData)
      const serverAgent = await createAgent({
        teamID: currentTeamInfo.id,
        agentRaw: agentRawData,
      }).unwrap()
      await deleteFormDataByTabID(currentTeamInfo.id, CREATE_TIPIS_ID)
      await updateCreateTipiTabToEditTipiTab(CREATE_TIPIS_ID, {
        tabName: serverAgent.name,
        tabIcon: "",
        cacheID: serverAgent.aiAgentID,
      })
      TipisTrack.track("save_suc", {
        parameter1: "create",
        parameter2: Array.isArray(currentData.knowledge)
          ? currentData.knowledge.length
          : 0,
      })
      return serverAgent
    },
    [
      createAgent,
      currentTeamInfo.id,
      updateCreateTipiTabToEditTipiTab,
      getAgentRowData,
    ],
  )

  const handleChangeAgent = useCallback(
    async (currentData: IAgentForm) => {
      const agentRawData = getAgentRowData(currentData)
      const serverAgent = await putAgentDetail({
        teamID: currentTeamInfo.id,
        aiAgentID: currentData.aiAgentID,
        agentRaw: agentRawData,
      }).unwrap()
      const recentTabs = getRecentTabInfos(store.getState())
      const currentAgentTabs = recentTabs.filter(
        (tabInfo) => tabInfo.cacheID === currentData.aiAgentID,
      )
      if (currentAgentTabs.length > 0) {
        const newTabInfo = {
          tabName: serverAgent.name,
          tabIcon: serverAgent.icon,
          cacheID: serverAgent.aiAgentID,
        }
        const oldTabIDMapNewInfos = currentAgentTabs.reduce(
          (acc, tabInfo) => {
            acc[tabInfo.tabID] = newTabInfo
            return acc
          },
          {} as { [oldTabID: string]: typeof newTabInfo },
        )
        await batchUpdateTabInfo(oldTabIDMapNewInfos)
      }

      TipisTrack.track("save_suc", {
        parameter1: "edit",
        parameter2: Array.isArray(currentData.knowledge)
          ? currentData.knowledge.length
          : 0,
      })
      return serverAgent
    },
    [batchUpdateTabInfo, currentTeamInfo.id, putAgentDetail, getAgentRowData],
  )

  const handleSubmitSave = useCallback(
    async (data: IAgentForm) => {
      let currentData: IAgentForm = { ...data }

      let agentInfo: Agent
      try {
        if (!currentData.icon) {
          currentData.icon = AgentInitial.icon
        } else {
          const iconURL = new URL(currentData.icon)
          if (iconURL.protocol === "data:") {
            const responseData = await getAgentIconUploadAddress({
              teamID: currentTeamInfo.id,
              base64: currentData.icon,
            }).unwrap()
            currentData.icon = await fetchUploadBase64(
              responseData.uploadAddress,
              currentData.icon,
            )
          }
        }

        if (
          currentData.aiAgentID === undefined ||
          currentData.aiAgentID === ""
        ) {
          agentInfo = await handleCreateAgent(currentData)
        } else {
          agentInfo = await handleChangeAgent(currentData)
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
          aiTools: Array.isArray(agentInfo.aiTools) ? agentInfo.aiTools : [],
        }
        reset(newFormData)

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
      reset,
      message,
      t,
      getAgentIconUploadAddress,
      currentTeamInfo.id,
      handleCreateAgent,
      handleChangeAgent,
    ],
  )

  return handleSubmitSave
}

export const mergeDefaultValueData = (originAgent: Agent) => {
  let fixedFormData = { ...originAgent }
  if (fixedFormData.triggerIsActive === undefined) {
    fixedFormData.triggerIsActive = false
  }
  if (fixedFormData.triggerConfig === undefined) {
    fixedFormData.triggerConfig = INIT_TRIGGER_CONFIG
  }
  return fixedFormData
}
