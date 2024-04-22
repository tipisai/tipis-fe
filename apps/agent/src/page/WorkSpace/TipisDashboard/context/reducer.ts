import { getCurrentId } from "@illa-public/user-data"
import {
  INITIAL_PAGE,
  PRODUCT_SORT_BY,
} from "@/redux/services/marketAPI/constants"
import store from "@/redux/store"
import { setCacheUIState } from "@/utils/localForage/uiState"
import { EXPLORE_TIPIS_ID } from "@/utils/recentTabs/constants"
import {
  DASH_BOARD_UI_STATE_ACTION_TYPE,
  IDashBoardUIState,
  TABS_KEY,
  TDashboardUIStateAction,
} from "./interface"

export const INIT_DASH_BOARD_UI_STATE: IDashBoardUIState = {
  page: INITIAL_PAGE,
  sortedBy: PRODUCT_SORT_BY.POPULAR,
  search: undefined,
  hashTag: undefined,
  activeTab: TABS_KEY.TEAM,
  isOfficial: false,
}

export const reducer = (
  state: IDashBoardUIState,
  action: TDashboardUIStateAction,
): IDashBoardUIState => {
  const currentTeamID = getCurrentId(store.getState())
  let newState = { ...state }
  switch (action.type) {
    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_PAGE: {
      newState = {
        ...state,
        page: action.payload,
      }
      break
    }
    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_SORTED_BY: {
      newState = {
        ...state,
        page: INITIAL_PAGE,
        sortedBy: action.payload,
      }
      break
    }
    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_SEARCH: {
      newState = {
        ...state,
        page: INITIAL_PAGE,
        search: action.payload,
      }
      break
    }

    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_HASH_TAG: {
      newState = {
        ...state,
        page: INITIAL_PAGE,
        hashTag: action.payload,
      }
      break
    }

    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_RECOMMEND_TAG: {
      newState = {
        ...state,
        page: INITIAL_PAGE,
        sortedBy: PRODUCT_SORT_BY.POPULAR,
        search: undefined,
        hashTag: action.payload,
      }
      break
    }
    case DASH_BOARD_UI_STATE_ACTION_TYPE.RESET_PARAMS: {
      newState = INIT_DASH_BOARD_UI_STATE
      break
    }

    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_ACTIVE_TAB: {
      newState = {
        ...state,
        activeTab: action.payload,
      }
      break
    }
    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE: {
      newState = {
        ...action.payload,
        page: INITIAL_PAGE,
      }
      break
    }
    case DASH_BOARD_UI_STATE_ACTION_TYPE.SET_IS_OFFICIAL: {
      newState = {
        ...state,
        page: INITIAL_PAGE,
        isOfficial: action.payload,
      }
      break
    }
  }
  setCacheUIState(currentTeamID!, EXPLORE_TIPIS_ID, newState)
  return newState
}
