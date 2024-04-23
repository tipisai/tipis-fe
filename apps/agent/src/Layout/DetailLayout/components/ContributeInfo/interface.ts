import { AgentEditor } from "@illa-public/public-types"

export interface IContributeInfoProps {
  teamName: string
  teamAvatar: string
  contributors: AgentEditor[]
  contributeLabelName?: string
}
