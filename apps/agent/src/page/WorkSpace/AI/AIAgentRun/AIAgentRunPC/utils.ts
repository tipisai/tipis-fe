import { useCallback, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { useSelector } from "react-redux"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import { canUseUpgradeFeature } from "@illa-public/user-role-utils"
import { IAgentForm } from "../../AIAgent/interface"
import { AgentWSContext } from "../../context/AgentWSContext"

export const useReRerunAgent = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const { reset } = useFormContext<IAgentForm>()

  const { reconnect } = useContext(AgentWSContext)

  const canUseBillingFeature = canUseUpgradeFeature(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicensePurchased,
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  const rerunAgent = useCallback(
    async (data: IAgentForm) => {
      if (!canUseBillingFeature) {
        // TODO: billing
        // upgradeModal({
        //   modalType: "agent",
        //   from: "agent_run_gpt4",
        // })
        return
      }
      reset(data)

      await reconnect()
    },
    [canUseBillingFeature, reconnect, reset],
  )

  return rerunAgent
}
