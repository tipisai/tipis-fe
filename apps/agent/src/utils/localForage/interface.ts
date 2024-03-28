import {
  ChatSendRequestPayload,
  ChatWsAppendResponse,
} from "@/components/PreviewChat/interface"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { ITabInfo } from "@/redux/ui/recentTab/interface"

export interface IUiHistoryData {
  formData?: IAgentForm
  chatMessage?: {
    edit: (ChatWsAppendResponse | ChatSendRequestPayload)[]
    run: (ChatWsAppendResponse | ChatSendRequestPayload)[]
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
