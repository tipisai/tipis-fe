import { Divider } from "antd"
import { FC } from "react"
import MobileDetailHeader from "@/Layout/DetailLayout/components/DetailHeader/mobile"
import Schedule from "@/page/WorkSpace/TipiDetail/components/Schedule"
import MobileActionGroup from "../../../../components/ActionGroup/mobile"
import Knowledge from "../../../../components/Knowledge"
import Parameters from "../../../../components/Parameters"
import Prompt from "../../../../components/Prompt"
import { INotContributeContentProps } from "../interface"

const MobileNotContributeContent: FC<INotContributeContentProps> = (props) => {
  const { agentInfo } = props
  return (
    <>
      <MobileDetailHeader
        avatarURL={agentInfo.icon}
        title={agentInfo.name}
        description={agentInfo.description}
      />
      <MobileActionGroup
        isContribute={false}
        tipisName={agentInfo.name}
        tipisID={agentInfo.aiAgentID}
        tipisIcon={agentInfo.icon}
        ownerTeamIdentity={agentInfo.teamIdentifier}
      />
      <Divider
        style={{
          margin: "0",
        }}
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

export default MobileNotContributeContent
