import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { t } from "i18next"
import { FC } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { canShownCreateTipi } from "@/utils/UIHelper/tipis"
import { useNavigateToCreateTipis } from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { useSearchTipisDashboard } from "../../../hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const navigateToCreateTipis = useNavigateToCreateTipis()

  const currentTeamInfo = useGetCurrentTeamInfo()

  const handleClickCreateTIpis = () => {
    TipisTrack.track("click_create_tipi_entry", {
      parameter2: "right_corner",
    })
    navigateToCreateTipis()
  }

  const { searchValue, handleChangeSearchValue } = useSearchTipisDashboard()

  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
        onChange={handleChangeSearchValue}
        value={searchValue}
      />
      {canShownCreateTipi(currentTeamInfo) && (
        <Button
          type="primary"
          icon={<Icon component={PlusIcon} />}
          size="large"
          onClick={handleClickCreateTIpis}
        >
          {t("dashboard.create")}
        </Button>
      )}
    </div>
  )
}

export default HeaderTools
