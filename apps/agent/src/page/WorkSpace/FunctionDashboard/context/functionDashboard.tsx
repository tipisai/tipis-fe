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
import { INIT_FUNCTION_DASHBOARD_UI_STATE, reducer } from "./reducer"

interface IFunctionDashboardUIInject {
  dashboardUIState: IFunctionDashBoardUIState
  dispatch: Dispatch<TFunctionDashboardUIStateAction>
}

interface IFunctionDashBoardUIStateProviderProps {
  children: ReactNode
}

export const FunctionDashBoardUIStateContext = createContext(
  {} as IFunctionDashboardUIInject,
)

export const FunctionDashboardUIStateProvider: FC<
  IFunctionDashBoardUIStateProviderProps
> = ({ children }) => {
  const currentTeamID = useSelector(getCurrentId)
  const [dashboardUIState, dispatch] = useReducer(
    reducer,
    INIT_FUNCTION_DASHBOARD_UI_STATE,
  )

  useEffect(() => {
    const setDefaultUIState = async () => {
      const uiState = await getCacheUIState(currentTeamID!, EXPLORE_FUNCTION_ID)
      dispatch({
        type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE,
        payload:
          (uiState as IFunctionDashBoardUIState) ??
          INIT_FUNCTION_DASHBOARD_UI_STATE,
      })
    }

    setDefaultUIState()
  }, [currentTeamID])

  return (
    <FunctionDashBoardUIStateContext.Provider
      value={{ dashboardUIState, dispatch }}
    >
      {children}
    </FunctionDashBoardUIStateContext.Provider>
  )
}
