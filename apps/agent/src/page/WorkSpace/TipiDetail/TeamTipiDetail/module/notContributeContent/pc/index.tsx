import { FC } from "react"
import Schedule from "@/page/WorkSpace/TipiDetail/components/Schedule"
import PCDetailHeader from "../../../../../../../Layout/DetailLayout/components/DetailHeader/pc"
import PCActionGroup from "../../../../components/ActionGroup/pc"
import Knowledge from "../../../../components/Knowledge"
import Parameters from "../../../../components/Parameters"
import Prompt from "../../../../components/Prompt"
import { INotContributeContentProps } from "../interface"

const PCNotContributeContent: FC<INotContributeContentProps> = (props) => {
  const { agentInfo } = props
  return (
    <>
      <PCDetailHeader
        avatarURL={agentInfo.icon}
        title={agentInfo.name}
        description={agentInfo.description}
      />
      <PCActionGroup
        isContribute={false}
        tipisName={agentInfo.name}
        tipisID={agentInfo.aiAgentID}
        tipisIcon={agentInfo.icon}
        ownerTeamIdentity={agentInfo.teamIdentifier}
      />
      {!!agentInfo.triggerIsActive && (
        <Schedule schedule={agentInfo.triggerConfig?.schedule ?? []} />
      )}
      <Prompt
        parameters={agentInfo.variables ?? []}
        prompt={agentInfo.prompt}
      />
      {Array.isArray(agentInfo.variables) && agentInfo.variables.length > 0 && (
        <Parameters parameters={agentInfo.variables} />
      )}
      {Array.isArray(agentInfo.knowledge) && agentInfo.knowledge.length > 0 && (
        <Knowledge knowledge={agentInfo.knowledge} />
      )}
    </>
  )
}

export default PCNotContributeContent
