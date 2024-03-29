import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { t } from "i18next"
import { debounce } from "lodash-es"
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { useAddCreateTipisTab } from "@/utils/recentTabs/hook"
import { DASH_BOARD_UI_STATE_ACTION_TYPE } from "../../../context/interface"
import { DashBoardUIStateContext } from "../../../context/marketListContext"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const addCreateTipiTab = useAddCreateTipisTab()

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

  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
        onChange={handleChangeSearchValue}
        value={searchValue}
      />
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={addCreateTipiTab}
      >
        {t("dashboard.create")}
      </Button>
    </div>
  )
}

export default HeaderTools
