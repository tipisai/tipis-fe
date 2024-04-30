import { getCurrentId } from "@illa-public/user-data"
import store from "@/redux/store"
import { setCacheUIState } from "@/utils/localForage/uiState"
import { EXPLORE_FUNCTION_ID } from "@/utils/recentTabs/constants"
import {
  FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE,
  IFunctionDashBoardUIState,
  TFunctionDashboardUIStateAction,
} from "./interface"

export const INIT_FUNCTION_DASHBOARD_UI_STATE: IFunctionDashBoardUIState = {
  search: undefined,
}

export const reducer = (
  state: IFunctionDashBoardUIState,
  action: TFunctionDashboardUIStateAction,
): IFunctionDashBoardUIState => {
  const currentTeamID = getCurrentId(store.getState())
  let newState = { ...state }
  switch (action.type) {
    case FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE: {
      newState = {
        ...action.payload,
      }
      break
    }
    case FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_SEARCH: {
      newState = {
        ...state,
        search: action.payload,
      }
      break
    }
  }
  setCacheUIState(currentTeamID!, EXPLORE_FUNCTION_ID, newState)
  return newState
}
