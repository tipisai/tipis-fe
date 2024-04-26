import { AI_AGENT_MODEL, AI_AGENT_TYPE, Agent } from "@illa-public/public-types"

export interface IAgentForm
  extends Omit<
    Agent,
    "createdAt" | "createdBy" | "updatedBy" | "updatedAt" | "editedBy"
  > {}

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
  icon: "https://cdn.tipis.ai/tipis/default-tipi-icon.png",
  description: "",
  aiAgentID: "",
  teamID: "",
  teamIcon: "",
  teamName: "",
  teamIdentifier: "",
  publishedToMarketplace: false,
  functions: [],
}

export enum SCROLL_ID {
  PROMPT = "prompt",
  VARIABLES = "variables",
  KNOWLEDGE = "knowledge",
  NAME = "name",
  DESCRIPTION = "description",
  ICON = "icon",
}
