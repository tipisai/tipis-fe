import { MarketAIAgent } from "@illa-public/market-agent"
import { Agent } from "@illa-public/public-types"

export interface IAIAgentRunProps {
  agent: Agent
  marketplace: MarketAIAgent | undefined
}
