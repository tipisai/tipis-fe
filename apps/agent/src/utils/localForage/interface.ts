import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import {
  ChatMessage,
  IGroupMessage,
} from "../../components/PreviewChat/interface"

export interface IUiHistoryData {
  formData?: IAgentForm
  chatMessage?: {
    create: unknown[]
    edit: unknown[]
    run: unknown[]
  }
  uiState?: unknown
}

export interface ITeamData {
  tabsInfo: ITabInfo[]
  uiHistory: {
    [key: string]: IUiHistoryData
  }
}

export interface ITeamDataDatabase {
  [key: string]: ITeamData
}

export interface IChatUIState {
  edit: (IGroupMessage | ChatMessage)[]
  run: (IGroupMessage | ChatMessage)[]
  create: (IGroupMessage | ChatMessage)[]
}
