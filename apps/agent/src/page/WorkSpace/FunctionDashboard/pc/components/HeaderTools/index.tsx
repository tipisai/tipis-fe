import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useContext } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { useSearchFunctionDashboard } from "../../../utils"
import { FunctionDashboardContext } from "../../context"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const { changeCreateFunctionModal } = useContext(FunctionDashboardContext)
  const { searchValue, handleChangeSearchValue } = useSearchFunctionDashboard()

  const handleClickCreateFunction = () => {
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
