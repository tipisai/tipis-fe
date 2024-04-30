import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useContext } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { useSearchFunctionDashboard } from "../../../utils"
import { FunctionDashboardContext } from "../../context"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const { changeCreateFunctionModal } = useContext(FunctionDashboardContext)
  const { searchValue, handleChangeSearchValue } = useSearchFunctionDashboard()

  const handleClickCreateFunction = () => {
    TipisTrack.track("click_create_function_entry", {
      parameter1: "dashboard_create",
    })

    changeCreateFunctionModal(true)
  }

  return (
    <>
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
          onClick={handleClickCreateFunction}
        >
          Create
        </Button>
      </div>
    </>
  )
}

export default HeaderTools
