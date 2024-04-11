import { ITabInfo } from "@/redux/ui/recentTab/interface"

export enum UI_HISTORY_TYPE {
  CREATE = "create",
  EDIT = "edit",
  RUN = "run",
}

export interface IUiHistoryData {
  formData?: unknown
  chatMessage?: unknown[]
  uiState?: unknown
}

export interface ITeamData {
  tabsInfo: ITabInfo[]
  uiHistory: {
    [tabID: string]: IUiHistoryData
  }
}

export interface ITeamDataDatabase {
  [teamID: string]: ITeamData
}
