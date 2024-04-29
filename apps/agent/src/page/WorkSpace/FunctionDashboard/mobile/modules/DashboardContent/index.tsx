import Icon from "@ant-design/icons"
import { Input } from "antd"
import { FC } from "react"
import { SearchIcon } from "@illa-public/icon"
import TeamCardList from "../../../components/TeamCardList"
import { useSearchFunctionDashboard } from "../../../utils"
import MobileTeamCardListItem from "../../components/TeamCardListItem"
import {
  cardListContainerStyle,
  dashboardContentStyle,
  searchInputStyle,
} from "./style"

const DashboardContent: FC = () => {
  const { searchValue, handleChangeSearchValue } = useSearchFunctionDashboard()

  return (
    <div css={dashboardContentStyle}>
      <div css={searchInputStyle}>
        <Input
          placeholder="Search"
          prefix={<Icon component={SearchIcon} />}
          size="large"
          value={searchValue}
          onChange={handleChangeSearchValue}
        />
      </div>

      <div css={cardListContainerStyle}>
        <TeamCardList RenderItem={MobileTeamCardListItem} />
      </div>
    </div>
  )
}

export default DashboardContent
