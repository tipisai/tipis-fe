import Icon from "@ant-design/icons"
import { Input } from "antd"
import { FC } from "react"
import { SearchIcon } from "@illa-public/icon"
import TeamCardList from "../../../components/TeamCardList"
import { cardListContainerStyle, dashboardContentStyle } from "./style"

const DashboardContent: FC = () => {
  return (
    <div css={dashboardContentStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
      />
      <div css={cardListContainerStyle}>
        <TeamCardList />
      </div>
    </div>
  )
}

export default DashboardContent
