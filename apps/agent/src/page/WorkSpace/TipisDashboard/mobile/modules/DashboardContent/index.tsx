import Icon from "@ant-design/icons"
import { Input } from "antd"
import { FC } from "react"
import { SearchIcon } from "@illa-public/icon"
import TeamCardList from "../../../components/TeamCardList"
import MobileTeamCardListItem from "../../components/TeamCardListItem"
import {
  cardListContainerStyle,
  dashboardContentStyle,
  searchInputStyle,
} from "./style"

const DashboardContent: FC = () => {
  return (
    <div css={dashboardContentStyle}>
      <div css={searchInputStyle}>
        <Input
          placeholder="Search"
          prefix={<Icon component={SearchIcon} />}
          size="large"
        />
      </div>

      <div css={cardListContainerStyle}>
        <TeamCardList RenderItem={MobileTeamCardListItem} />
      </div>
    </div>
  )
}

export default DashboardContent
