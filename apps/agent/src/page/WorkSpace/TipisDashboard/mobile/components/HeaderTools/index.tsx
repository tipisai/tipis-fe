import Icon from "@ant-design/icons"
import { Button } from "antd"
import { t } from "i18next"
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { PlusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { getCreateTipiPath } from "@/utils/routeHelper"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const onClickCreateTipi = () => {
    const tempID = v4()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.CREATE_TIPIS,
      tabID: tempID,
      cacheID: tempID,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(getCreateTipiPath(currentTeamInfo.identifier, tempID))
  }

  return (
    <div css={headerToolsContainerStyle}>
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={onClickCreateTipi}
      >
        {t("dashboard.create")}
      </Button>
    </div>
  )
}

export default HeaderTools
