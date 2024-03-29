import { List } from "antd"
import Fuse from "fuse.js"
import { FC, useContext, useMemo } from "react"
import { useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import FullSectionLoading from "@/components/FullSectionLoading"
import TeamNoData from "@/components/TeamNoData"
import { useGetAIAgentListByPageQuery } from "@/redux/services/agentAPI"
import { useNavigateToCreateTipis } from "@/utils/routeHelper/hook"
import { DashBoardUIStateContext } from "../../context/marketListContext"
import { ITeamCardListProps } from "./interface"

const TeamCardList: FC<ITeamCardListProps> = (props) => {
  const { RenderItem } = props
  const currentTeamID = useSelector(getCurrentId)!
  const navigateToCreateTipis = useNavigateToCreateTipis()
  const { dashboardUIState } = useContext(DashBoardUIStateContext)
  const { search } = dashboardUIState
  const agentQuery = useMemo(
    () => ({
      teamID: currentTeamID,
    }),
    [currentTeamID],
  )

  const { data, isLoading } = useGetAIAgentListByPageQuery(agentQuery)

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (!data?.aiAgentList || data.aiAgentList.length === 0) {
    return <TeamNoData showCreate onClickButton={navigateToCreateTipis} />
  }

  const fuseSearch = new Fuse(data.aiAgentList, {
    keys: ["name", "description"],
  }).search(search ?? "")

  const searchResult =
    fuseSearch.length > 0 ? fuseSearch.map((s) => s.item) : data.aiAgentList

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
          icon={item.icon}
          title={item.name}
          description={item.description}
          publishToMarketplace={item.publishedToMarketplace}
          id={item.aiAgentID}
        />
      )}
    />
  )
}

export default TeamCardList
