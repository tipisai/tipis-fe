import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { getCurrentTeamInfo, getPlanUtils } from "@illa-public/user-data"
import {
  ACTION_MANAGE,
  ATTRIBUTE_GROUP,
  canManage,
} from "@illa-public/user-role-utils"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import MoreActionButton from "../../../components/MoreActionButton"
import ForkButton from "../ForkButton"
import StartButton from "../StartButton"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { control } = useFormContext<IAgentForm>()

  const [
    publishedToMarketplace,
    agentID,
    agentName,
    agentIcon,
    ownerTeamIdentifier,
  ] = useWatch({
    control: control,
    name: [
      "publishedToMarketplace",
      "aiAgentID",
      "name",
      "icon",
      "teamIdentifier",
    ],
  })

  const { data: marketplaceAgentInfo } = useGetAIAgentMarketplaceInfoQuery(
    { aiAgentID: agentID },
    {
      skip: !publishedToMarketplace,
    },
  )

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
        agentIcon={agentIcon}
        ownerTeamIdentifier={ownerTeamIdentifier}
        publishConfiguration={
          !!marketplaceAgentInfo?.marketplace?.config?.publishConfiguration
        }
      />
      {canManageFork &&
        publishedToMarketplace &&
        marketplaceAgentInfo?.marketplace?.config?.publishConfiguration && (
          <ForkButton />
        )}
      <StartButton />
    </div>
  )
}

export default HeaderTools
