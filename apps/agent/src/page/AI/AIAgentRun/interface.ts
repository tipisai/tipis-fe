import { Agent, MarketAIAgent } from "@illa-public/public-types"

export interface IAIAgentRunProps {
  agent: Agent
  marketplace: MarketAIAgent | undefined
}
