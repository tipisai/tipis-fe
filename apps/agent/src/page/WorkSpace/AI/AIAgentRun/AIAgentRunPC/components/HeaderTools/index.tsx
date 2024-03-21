import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import {
  ACTION_MANAGE,
  ATTRIBUTE_GROUP,
  canManage,
} from "@illa-public/user-role-utils"
import MoreActionButton from "../../../components/MoreActionButton"
import ForkButton from "../ForkButton"
import StarButton from "../StarButton"
import StartButton from "../StartButton"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { control } = useFormContext<Agent>()

  // agentID, agentName, publishToMarketplace, isMobile
  const [publishedToMarketplace, agentID, agentName] = useWatch({
    control: control,
    name: ["publishedToMarketplace", "aiAgentID", "name"],
  })

  const canManageFork = canManage(
    currentTeamInfo.myRole,
    ATTRIBUTE_GROUP.AI_AGENT,
    getPlanUtils(currentTeamInfo),
    ACTION_MANAGE.FORK_AI_AGENT,
  )

  return (
    <div css={headerToolsContainerStyle}>
      <MoreActionButton
        publishToMarketplace={publishedToMarketplace}
        agentID={agentID}
        agentName={agentName}
        isMobile={false}
      />
      {canManageFork && publishedToMarketplace && <ForkButton />}
      {publishedToMarketplace && <StarButton />}
      <StartButton />
    </div>
  )
}

export default HeaderTools
