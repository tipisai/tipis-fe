import { AI_AGENT_MODEL, AI_AGENT_TYPE } from "@illa-public/public-types"

export const INIT_CHAT_CONFIG = {
  variables: [],
  actionID: "",
  modelConfig: {
    stream: true,
  },
  model: AI_AGENT_MODEL.GPT_3_5,
  agentType: AI_AGENT_TYPE.CHAT,
}

export const DEFAULT_PROMO = "You are a helpful assistant."