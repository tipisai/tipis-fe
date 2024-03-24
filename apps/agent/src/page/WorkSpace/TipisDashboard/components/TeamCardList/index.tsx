import { List } from "antd"
import { FC, useMemo } from "react"
import { useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAIAgentListByPageQuery } from "@/redux/services/agentAPI"
import { ITeamCardListProps } from "./interface"

const TeamCardList: FC<ITeamCardListProps> = (props) => {
  const { RenderItem } = props
  const currentTeamID = useSelector(getCurrentId)!

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
    return <div>No Data</div>
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
      dataSource={data.aiAgentList}
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
