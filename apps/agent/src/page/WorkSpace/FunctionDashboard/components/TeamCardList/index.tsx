import { List } from "antd"
import Fuse from "fuse.js"
import { FC, useContext } from "react"
import FullSectionLoading from "@/components/FullSectionLoading"
import TeamNoData from "@/components/TeamNoData"
import { useGetAllAIToolsListQuery } from "@/redux/services/aiToolsAPI"
import { canShowCreateFunction } from "@/utils/UIHelper/functions"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { FunctionDashBoardUIStateContext } from "../../context/functionDashboard"
import { FunctionDashboardContext } from "../../pc/context"
import { ITeamCardListProps } from "./interface"

const TeamCardList: FC<ITeamCardListProps> = (props) => {
  const { RenderItem } = props
  const currentTeamInfo = useGetCurrentTeamInfo()!

  const { changeCreateFunctionModal } = useContext(FunctionDashboardContext)

  const { dashboardUIState } = useContext(FunctionDashBoardUIStateContext)
  const { search } = dashboardUIState

  const { data, isLoading } = useGetAllAIToolsListQuery(currentTeamInfo.id)

  const handleClickCreateTipis = () => {
    changeCreateFunctionModal(true)
  }

  const fuseSearch = new Fuse(data?.aiToolList ?? [], {
    keys: ["name", "description"],
  }).search(search ?? "")

  const searchResult = search
    ? fuseSearch.length > 0
      ? fuseSearch.map((s) => s.item)
      : []
    : data?.aiToolList ?? []

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (searchResult.length === 0) {
    return (
      <TeamNoData
        showCreate={!!canShowCreateFunction(currentTeamInfo)}
        onClickButton={handleClickCreateTipis}
      />
    )
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      dataSource={searchResult}
      renderItem={(item) => (
        <RenderItem
          icon={item.config.icon}
          title={item.name}
          description={item.description}
          publishToMarketplace={item.publishedToMarketplace}
          id={item.aiToolID}
        />
      )}
    />
  )
}

export default TeamCardList
