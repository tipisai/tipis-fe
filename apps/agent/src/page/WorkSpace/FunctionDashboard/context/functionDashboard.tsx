import {
  Dispatch,
  FC,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react"
import { useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import { getCacheUIState } from "@/utils/localForage/uiState"
import { EXPLORE_FUNCTION_ID } from "@/utils/recentTabs/constants"
import {
  FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE,
  IFunctionDashBoardUIState,
  TFunctionDashboardUIStateAction,
} from "./interface"
import { INIT_DASH_BOARD_UI_STATE, reducer } from "./reducer"

interface IDashboardUIInject {
  dashboardUIState: IFunctionDashBoardUIState
  dispatch: Dispatch<TFunctionDashboardUIStateAction>
}

interface IDashBoardUIStateProviderProps {
  children: ReactNode
}

export const DashBoardUIStateContext = createContext({} as IDashboardUIInject)

export const DashboardUIStateProvider: FC<IDashBoardUIStateProviderProps> = ({
  children,
}) => {
  const currentTeamID = useSelector(getCurrentId)
  const [dashboardUIState, dispatch] = useReducer(
    reducer,
    INIT_DASH_BOARD_UI_STATE,
  )

  useEffect(() => {
    const setDefaultUIState = async () => {
      const uiState = await getCacheUIState(currentTeamID!, EXPLORE_FUNCTION_ID)
      dispatch({
        type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE,
        payload:
          (uiState as IFunctionDashBoardUIState) ?? INIT_DASH_BOARD_UI_STATE,
      })
    }

    setDefaultUIState()
  }, [currentTeamID])

  return (
    <DashBoardUIStateContext.Provider value={{ dashboardUIState, dispatch }}>
      {children}
    </DashBoardUIStateContext.Provider>
  )
}
