import { AI_AGENT_MODEL, AI_AGENT_TYPE, Agent } from "@illa-public/public-types"

export interface IAgentForm
  extends Omit<
    Agent,
    | "teamID"
    | "teamIcon"
    | "teamName"
    | "publishedToMarketplace"
    | "teamIdentifier"
    | "createdAt"
    | "createdBy"
    | "updatedBy"
    | "updatedAt"
    | "editedBy"
  > {
  cacheID: string
  formIsDirty?: boolean
}

export const AgentInitial: IAgentForm = {
  name: "",
  agentType: AI_AGENT_TYPE.CHAT,
  model: AI_AGENT_MODEL.GPT_4,
  variables: [{ key: "", value: "" }],
  knowledge: [],
  prompt: "",
  modelConfig: {
    stream: true,
  },
  icon: "https://cdn.tipis.ai.sfo3.cdn.digitaloceanspaces.com/tipis/default-tipi-icon.png",
  description: "",
  aiAgentID: "",
  cacheID: "",
}

export enum SCROLL_ID {
  PROMPT = "prompt",
  VARIABLES = "variables",
  KNOWLEDGE = "knowledge",
  NAME = "name",
  DESCRIPTION = "description",
  ICON = "icon",
}
