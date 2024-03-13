import { useCallback, useContext } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { isPremiumModel } from "@illa-public/market-agent"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { useUpgradeModal } from "@illa-public/upgrade-modal"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import { canUseUpgradeFeature } from "@illa-public/user-role-utils"
import { track } from "../../../../../utils/mixpanelHelper"
import { AgentWSContext } from "../../context/AgentWSContext"

export const useReRerunAgent = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const upgradeModal = useUpgradeModal()
  const { reset, control } = useFormContext<Agent>()
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
    async (data: Agent) => {
      if (isPremiumModel(data.model) && !canUseBillingFeature) {
        upgradeModal({
          modalType: "agent",
          from: "agent_run_gpt4",
        })
        return
      }
      reset(data)
      track(
        ILLA_MIXPANEL_EVENT_TYPE.CLICK,
        ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
        {
          element: "restart",
          parameter1: data.agentType === 1 ? "chat" : "text",
          parameter5: aiAgentID,
        },
      )
      await reconnect()
    },
    [aiAgentID, canUseBillingFeature, reconnect, reset, upgradeModal],
  )

  return rerunAgent
}
