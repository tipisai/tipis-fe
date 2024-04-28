import { List } from "antd"
import Fuse from "fuse.js"
import { FC, useContext } from "react"
import { TipisTrack } from "@illa-public/track-utils"
import FullSectionLoading from "@/components/FullSectionLoading"
import TeamNoData from "@/components/TeamNoData"
import { useGetAllAIToolsListQuery } from "@/redux/services/aiToolsAPI"
import { canShowCreateFunction } from "@/utils/UIHelper/functions"
import { useNavigateToCreateTipis } from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { DashBoardUIStateContext } from "../../context/functionDashboard"
import { ITeamCardListProps } from "./interface"

const TeamCardList: FC<ITeamCardListProps> = (props) => {
  const { RenderItem } = props
  const currentTeamInfo = useGetCurrentTeamInfo()

  const navigateToCreateTipis = useNavigateToCreateTipis()

  const { dashboardUIState } = useContext(DashBoardUIStateContext)
  const { search } = dashboardUIState

  const { data, isLoading } = useGetAllAIToolsListQuery({
    teamID: currentTeamInfo?.id || "",
    sortBy: "updateAt",
  })

  const handleClickCreateTipis = () => {
    TipisTrack.track("click_create_tipi_entry", {
      parameter2: "right_corner",
    })
    navigateToCreateTipis()
  }

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (data?.totalAIToolCount === 0) {
    return (
      <TeamNoData
        showCreate={!!canShowCreateFunction(currentTeamInfo)}
        onClickButton={handleClickCreateTipis}
      />
    )
  }

  const fuseSearch = new Fuse(data?.aiToolList ?? [], {
    keys: ["name", "description"],
  }).search(search ?? "")

  const searchResult =
    fuseSearch.length > 0 ? fuseSearch.map((s) => s.item) : data?.aiToolList

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
