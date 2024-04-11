import { App } from "antd"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import {
  useCreateAgentMutation,
  useGetAgentIconUploadAddressMutation,
  usePutAgentDetailMutation,
} from "@/redux/services/agentAPI"
import { fetchUploadBase64 } from "@/utils/file"
import { deleteFormDataByTabID } from "@/utils/localForage/teamData"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"
import { useUpdateCreateTipiTabToEditTipiTab } from "@/utils/recentTabs/hook"
import { AgentInitial, IAgentForm } from "./interface"

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

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { reset } = useFormContext<IAgentForm>()

  const handleSubmitSave = useCallback(
    async (data: IAgentForm) => {
      let currentData: IAgentForm = { ...data }

      let agentInfo: Agent
      try {
        let updateIconURL = currentData.icon
        if (!updateIconURL) {
          updateIconURL = AgentInitial.icon
        } else {
          const iconURL = new URL(currentData.icon)
          if (iconURL.protocol === "data:") {
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
          await deleteFormDataByTabID(currentTeamInfo.id, CREATE_TIPIS_ID)
          await updateCreateTipiTabToEditTipiTab(CREATE_TIPIS_ID, {
            tabName: serverAgent.name,
            tabIcon: "",
            cacheID: serverAgent.aiAgentID,
          })

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

        TipisTrack.track("save_suc", {
          parameter1: currentData.aiAgentID ? "edit" : "create",
          parameter2: Array.isArray(agentInfo.knowledge)
            ? agentInfo.knowledge.length
            : 0,
        })
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
      createAgent,
      updateCreateTipiTabToEditTipiTab,
      putAgentDetail,
    ],
  )

  return handleSubmitSave
}
