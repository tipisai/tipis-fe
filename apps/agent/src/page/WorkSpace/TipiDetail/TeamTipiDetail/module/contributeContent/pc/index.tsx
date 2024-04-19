import { FC } from "react"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import PCDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/pc"
import PCActionGroup from "../../../../components/ActionGroup/pc"
import Knowledge from "../../../../components/Knowledge"
import Parameters from "../../../../components/Parameters"
import Prompt from "../../../../components/Prompt"
import { IContributeContentProps } from "../interface"

const PCContributeContent: FC<IContributeContentProps> = ({
  aiAgentMarketPlaceInfo,
}) => {
  return (
    <>
      <PCDetailHeader
        avatarURL={aiAgentMarketPlaceInfo.aiAgent.icon}
        title={aiAgentMarketPlaceInfo.aiAgent.name}
        description={aiAgentMarketPlaceInfo.aiAgent.description}
      />
      <PCActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo.marketplace.numRuns}
        forkNumber={aiAgentMarketPlaceInfo.marketplace.numForks}
        tipisName={aiAgentMarketPlaceInfo.aiAgent.name}
        tipisID={aiAgentMarketPlaceInfo.aiAgent.aiAgentID}
        tipisIcon={aiAgentMarketPlaceInfo.aiAgent.icon}
        ownerTeamIdentity={aiAgentMarketPlaceInfo.aiAgent.teamIdentifier}
        isPublishConfiguration={
          aiAgentMarketPlaceInfo.marketplace.config.publishConfiguration
        }
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo.marketplace.contributorTeam.name}
        teamAvatar={aiAgentMarketPlaceInfo.marketplace.contributorTeam.icon}
        contributorAvatars={aiAgentMarketPlaceInfo.aiAgent.editedBy.map(
          (item) => item.avatar,
        )}
      />
      {aiAgentMarketPlaceInfo.marketplace.config.publishConfiguration && (
        <>
          <Prompt
            parameters={aiAgentMarketPlaceInfo.aiAgent.variables ?? []}
            prompt={aiAgentMarketPlaceInfo.aiAgent.prompt}
          />
          {Array.isArray(aiAgentMarketPlaceInfo.aiAgent.variables) &&
            aiAgentMarketPlaceInfo.aiAgent.variables.length > 0 && (
              <Parameters
                parameters={aiAgentMarketPlaceInfo.aiAgent.variables}
              />
            )}
          {Array.isArray(aiAgentMarketPlaceInfo.aiAgent.knowledge) &&
            aiAgentMarketPlaceInfo.aiAgent.knowledge.length > 0 && (
              <Knowledge knowledge={aiAgentMarketPlaceInfo.aiAgent.knowledge} />
            )}
        </>
      )}
    </>
  )
}

export default PCContributeContent
