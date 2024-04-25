import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  Agent,
  SCHEDULE_TYPES,
} from "@illa-public/public-types"
import { ILLADayjs } from "@illa-public/utils"

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
  schedule: {
    enabled: false,
    timezone: ILLADayjs.tz.guess(),
    type: SCHEDULE_TYPES.EVERY_DAY,
    options: {
      hour: 0,
      minute: 0,
      interval: 1,
    },
  },
}

export enum SCROLL_ID {
  PROMPT = "prompt",
  VARIABLES = "variables",
  KNOWLEDGE = "knowledge",
  NAME = "name",
  DESCRIPTION = "description",
  ICON = "icon",
}
