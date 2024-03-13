import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ForkIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { formatNumForAgent } from "@illa-public/utils"
import { useForkAIAgentToTeamMutation } from "@/redux/services/agentAPI"
import { track } from "@/utils/mixpanelHelper"
import { MarketplaceInfoContext } from "../../../contexts/MarketplaceInfoContext"

const ForkButton: FC = () => {
  const { t } = useTranslation()
  const { currentMarketplaceInfo } = useContext(MarketplaceInfoContext)

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const navigate = useNavigate()
  const { message: messageAPI } = App.useApp()

  const [forkLoading, setForkLoading] = useState(false)
  const { control } = useFormContext<Agent>()
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })
  const [forkAIAgentToTeam] = useForkAIAgentToTeamMutation()

  const handleClickFork = async () => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
      {
        element: "fork",
        parameter5: aiAgentID,
      },
    )
    setForkLoading(true)
    try {
      const newAgent = await forkAIAgentToTeam({
        teamID: currentTeamInfo.id,
        aiAgentID: aiAgentID,
      }).unwrap()
      navigate(`/${currentTeamInfo.identifier}/ai-agent/${newAgent.aiAgentID}`)
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
      <span>{t("marketplace.fork")}</span>
      {(currentMarketplaceInfo?.marketplace.numForks ?? 0) > 0 && (
        <span>
          {" "}
          {formatNumForAgent(currentMarketplaceInfo?.marketplace.numForks ?? 0)}
        </span>
      )}
    </Button>
  )
}

export default ForkButton
