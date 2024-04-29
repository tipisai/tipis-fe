export interface IFunctionDashBoardUIState {
  search: string | undefined
}

export enum FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE {
  SET_SEARCH = "SET_SEARCH",
  SET_UI_STATE = "SET_UI_STATE",
}

export interface IFunctionDashBoardUIStateBaseAction<T = unknown> {
  type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE
  payload: T
}

export interface ISetSearchAction
  extends IFunctionDashBoardUIStateBaseAction<string | undefined> {
  type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_SEARCH
}

export interface ISetUIStateAction
  extends IFunctionDashBoardUIStateBaseAction<IFunctionDashBoardUIState> {
  type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE
}

export type TFunctionDashboardUIStateAction =
  | ISetSearchAction
  | ISetUIStateAction
