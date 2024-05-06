import { Divider } from "antd"
import { FC } from "react"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import MobileDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/mobile"
import MobileActionGroup from "@/page/WorkSpace/TipiDetail/components/ActionGroup/mobile"
import Schedule from "@/page/WorkSpace/TipiDetail/components/Schedule"
import Knowledge from "../../../../components/Knowledge"
import Parameters from "../../../../components/Parameters"
import Prompt from "../../../../components/Prompt"
import { IContributeContentProps } from "../interface"

const MobileContributeContent: FC<IContributeContentProps> = ({
  aiAgentMarketPlaceInfo,
}) => {
  return (
    <>
      <MobileDetailHeader
        avatarURL={aiAgentMarketPlaceInfo.aiAgent.icon}
        title={aiAgentMarketPlaceInfo.aiAgent.name}
        description={aiAgentMarketPlaceInfo.aiAgent.description}
      />
      <MobileActionGroup
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
      <Divider
        style={{
          margin: "0",
        }}
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo.marketplace.contributorTeam.name}
        teamAvatar={aiAgentMarketPlaceInfo.marketplace.contributorTeam.icon}
        contributors={aiAgentMarketPlaceInfo.aiAgent.editedBy}
      />
      {aiAgentMarketPlaceInfo.marketplace.config.publishConfiguration && (
        <>
          {!!aiAgentMarketPlaceInfo.aiAgent.triggerIsActive && (
            <Schedule
              schedule={
                aiAgentMarketPlaceInfo.aiAgent.triggerConfig?.schedule ?? []
              }
            />
          )}
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

export default MobileContributeContent
