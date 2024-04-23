import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ForkIcon } from "@illa-public/icon"
import { formatNumForAgent } from "@illa-public/utils"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { useForkAIAgentToTeamMutation } from "@/redux/services/agentAPI"
import { getEditTipiPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MarketplaceInfoContext } from "../../../contexts/MarketplaceInfoContext"

const ForkButton: FC = () => {
  const { t } = useTranslation()
  const { currentMarketplaceInfo } = useContext(MarketplaceInfoContext)

  const currentTeamInfo = useGetCurrentTeamInfo()
  const navigate = useNavigate()
  const { message: messageAPI } = App.useApp()

  const [forkLoading, setForkLoading] = useState(false)
  const { control } = useFormContext<IAgentForm>()
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })
  const [forkAIAgentToTeam] = useForkAIAgentToTeamMutation()

  const handleClickFork = async () => {
    if (!currentTeamInfo) return
    setForkLoading(true)
    try {
      const newAgent = await forkAIAgentToTeam({
        teamID: currentTeamInfo.id,
        aiAgentID: aiAgentID,
      }).unwrap()
      navigate(getEditTipiPath(currentTeamInfo.identifier, newAgent.aiAgentID))
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.fork-failed"),
      })
    } finally {
      setForkLoading(false)
    }
  }

  return (
    <Button
      size="large"
      icon={<Icon component={ForkIcon} />}
      onClick={handleClickFork}
      loading={forkLoading}
    >
      <span>{t("marketplace.fork")}&nbsp;</span>
      {(currentMarketplaceInfo?.marketplace.numForks ?? 0) > 0 && (
        <span>
          {formatNumForAgent(currentMarketplaceInfo?.marketplace.numForks ?? 0)}
        </span>
      )}
    </Button>
  )
}

export default ForkButton
