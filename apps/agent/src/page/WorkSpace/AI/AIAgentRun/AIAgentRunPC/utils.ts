import { useCallback, useContext } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { isPremiumModel } from "@illa-public/market-agent"
import { TIPIS_TRACK_EVENT_TYPE } from "@illa-public/track-utils"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import { canUseUpgradeFeature } from "@illa-public/user-role-utils"
import { track } from "@/utils/trackHelper"
import { IAgentForm } from "../../AIAgent/interface"
import { AgentWSContext } from "../../context/AgentWSContext"

export const useReRerunAgent = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const { reset, control } = useFormContext<IAgentForm>()
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })

  const { reconnect } = useContext(AgentWSContext)

  const canUseBillingFeature = canUseUpgradeFeature(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicensePurchased,
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const rerunAgent = useCallback(
    async (data: IAgentForm) => {
      if (isPremiumModel(data.model) && !canUseBillingFeature) {
        // TODO: billing
        // upgradeModal({
        //   modalType: "agent",
        //   from: "agent_run_gpt4",
        // })
        return
      }
      reset(data)
      track(TIPIS_TRACK_EVENT_TYPE.CLICK, {
        element: "restart",
        parameter1: data.agentType === 1 ? "chat" : "text",
        parameter5: aiAgentID,
      })
      await reconnect()
    },
    [aiAgentID, canUseBillingFeature, reconnect, reset],
  )

  return rerunAgent
}
