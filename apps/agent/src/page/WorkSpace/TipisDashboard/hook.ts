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
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "./context/interface"
import { DashBoardUIStateContext } from "./context/marketListContext"

export const useSearchTipisDashboard = () => {
  const { dispatch, dashboardUIState } = useContext(DashBoardUIStateContext)
  const { search } = dashboardUIState
  const [searchValue, setSearchValue] = useState(search)
  const prevSearchRef = useRef(search)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      prevSearchRef.current = v
      dispatch({
        type: DASH_BOARD_UI_STATE_ACTION_TYPE.SET_SEARCH,
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
