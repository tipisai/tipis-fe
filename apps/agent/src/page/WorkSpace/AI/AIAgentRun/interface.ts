import { Agent, IMarketAIAgent } from "@illa-public/public-types"

export interface IAIAgentRunProps {
  agent: Agent
  marketplace: IMarketAIAgent | undefined
}
