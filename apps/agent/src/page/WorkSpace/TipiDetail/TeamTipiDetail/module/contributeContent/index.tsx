import { FC } from "react"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import PCDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/pc"
import PCActionGroup from "../../../components/ActionGroup/pc"
import Knowledge from "../../../components/Knowledge"
import Parameters from "../../../components/Parameters"
import Prompt from "../../../components/Prompt"
import { IContributeContentProps } from "./interface"

const ContributeContent: FC<IContributeContentProps> = ({
  contributeAgentDetail,
  aiAgentMarketPlaceInfo,
}) => {
  return (
    <>
      <PCDetailHeader
        avatarURL={contributeAgentDetail.icon}
        title={contributeAgentDetail.name}
        description={contributeAgentDetail.description}
      />
      <PCActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo.marketplace.numRuns}
        forkNumber={aiAgentMarketPlaceInfo.marketplace.numForks}
        starNumber={aiAgentMarketPlaceInfo.marketplace.numStars}
        tipisName={contributeAgentDetail.name}
        tipisID={contributeAgentDetail.aiAgentID}
        tipisIcon={contributeAgentDetail.icon}
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo.marketplace.contributorTeam.name}
        teamAvatar={aiAgentMarketPlaceInfo.marketplace.contributorTeam.icon}
        contributorAvatars={contributeAgentDetail.editedBy.map(
          (item) => item.avatar,
        )}
      />
      <Prompt
        parameters={contributeAgentDetail.variables ?? []}
        prompt={contributeAgentDetail.prompt}
      />
      {Array.isArray(contributeAgentDetail.variables) &&
        contributeAgentDetail.variables.length > 0 && (
          <Parameters parameters={contributeAgentDetail.variables} />
        )}
      {Array.isArray(contributeAgentDetail.knowledge) &&
        contributeAgentDetail.knowledge.length > 0 && (
          <Knowledge knowledge={contributeAgentDetail.knowledge} />
        )}
    </>
  )
}

export default ContributeContent
