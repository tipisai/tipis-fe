import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { t } from "i18next"
import { debounce } from "lodash-es"
import { ChangeEvent, FC, useCallback, useContext, useMemo } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { useCreateTipis } from "@/utils/recentTabs/hook"
import { MarketListContext } from "../../../context/marketListContext"
import { MARKET_ACTION_TYPE } from "../../../context/reducer"
import { TABS_KEY } from "../../constant"
import { headerToolsContainerStyle } from "./style"

interface IHeaderToolsProps {
  activeTab: TABS_KEY
}

const HeaderTools: FC<IHeaderToolsProps> = ({ activeTab }) => {
  const createTipi = useCreateTipis()

  const { dispatch } = useContext(MarketListContext)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      if (activeTab === TABS_KEY.MARKETPLACE) {
        dispatch({
          type: MARKET_ACTION_TYPE.SET_SEARCH,
          payload: v,
        })
      }
    },
    [activeTab, dispatch],
  )

  const debounceHandleChange = useMemo(() => {
    return debounce(handleChange, 160)
  }, [handleChange])

  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
        onChange={debounceHandleChange}
      />
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={createTipi}
      >
        {t("dashboard.create")}
      </Button>
    </div>
  )
}

export default HeaderTools
