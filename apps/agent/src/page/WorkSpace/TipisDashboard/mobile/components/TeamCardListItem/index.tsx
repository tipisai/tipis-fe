import { ConfigProvider, List, Tag } from "antd"
import { FC } from "react"
import TeamCard from "@/components/TeamCard"
import { useRunTipis } from "@/utils/recentTabs/hook"
import { ITeamCardListItemProps } from "../../../components/TeamCardList/interface"

const MobileTeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const runTipis = useRunTipis()

  const onClickCard = () => {
    runTipis(id)
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            paddingLG: 16,
          },
        },
      }}
    >
      <List.Item>
        <TeamCard
          icon={icon}
          title={title}
          description={description}
          tags={tags}
          onClickCard={onClickCard}
          moreButton={null}
          editButton={null}
        />
      </List.Item>
    </ConfigProvider>
  )
}

export default MobileTeamCardListItem
