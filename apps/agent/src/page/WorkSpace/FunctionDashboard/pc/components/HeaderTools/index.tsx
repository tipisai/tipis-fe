import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const onClickCreateFunction = () => {
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CREATE_FUNCTION,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(
      `/workspace/${currentTeamInfo?.identifier}/function/create/${tempID}`,
    )
  }
  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
      />
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={onClickCreateFunction}
      >
        Create
      </Button>
    </div>
  )
}

export default HeaderTools
