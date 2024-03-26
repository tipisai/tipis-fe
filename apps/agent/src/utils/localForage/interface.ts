import { ChatMessage } from "@/components/PreviewChat/interface"
import { ITabInfo } from "@/redux/ui/recentTab/interface"

export interface IUiHistoryData {
  formData?: unknown
  chatMessage?: ChatMessage[]
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
