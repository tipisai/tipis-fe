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
import { getCacheUIState } from "../../../../utils/localForage/teamData"
import { EXPLORE_TIPIS_ID } from "../../../../utils/recentTabs/constants"
import {
  DASH_BOARD_UI_STATE_ACTION_TYPE,
  IDashBoardUIState,
  TDashboardUIStateAction,
} from "./interface"
import { INIT_DASH_BOARD_UI_STATE, reducer } from "./reducer"

interface IDashboardUIInject {
  dashboardUIState: IDashBoardUIState
  dispatch: Dispatch<TDashboardUIStateAction>
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
      const uiState = await getCacheUIState(currentTeamID!, EXPLORE_TIPIS_ID)
      dispatch({
        type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_UI_STATE,
        payload: (uiState as IDashBoardUIState) ?? INIT_DASH_BOARD_UI_STATE,
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
