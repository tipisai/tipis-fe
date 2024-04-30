import { debounce } from "lodash-es"
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FunctionDashBoardUIStateContext } from "./context/functionDashboard"
import { FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE } from "./context/interface"

export const useSearchFunctionDashboard = () => {
  const { dispatch, dashboardUIState } = useContext(
    FunctionDashBoardUIStateContext,
  )

  const { search } = dashboardUIState
  const [searchValue, setSearchValue] = useState(search)
  const prevSearchRef = useRef(search)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      prevSearchRef.current = v
      dispatch({
        type: FUNCTION_DASHBOARD_UI_STATE_ACTION_TYPE.SET_SEARCH,
        payload: v,
      })
    },
    [dispatch],
  )

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      setSearchValue(search)
      prevSearchRef.current = search
    }
  }, [search])

  const debounceHandleChange = useMemo(() => {
    return debounce(handleChange, 160)
  }, [handleChange])

  const handleChangeSearchValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      debounceHandleChange(e)
    },
    [debounceHandleChange],
  )

  return {
    searchValue,
    handleChangeSearchValue,
  }
}
